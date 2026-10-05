export type CameraFacingMode = "user" | "environment";

export const CALL_VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 1280, max: 1280 },
  height: { ideal: 720, max: 720 },
  frameRate: { ideal: 30, max: 30 },
};

interface SwitchCallCameraOptions {
  stream: MediaStream;
  facingMode: CameraFacingMode;
  previousFacingMode: CameraFacingMode;
  getPeerConnection: () => RTCPeerConnection | null;
  isActive: () => boolean;
}

function errorName(error: unknown): string {
  // DOMException and errors crossing a browser realm need not be instanceof Error.
  return typeof error === "object" && error !== null && "name" in error && typeof error.name === "string"
    ? error.name : "";
}

export function getCallMediaSupportError(): string | null {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return "Camera and microphone access requires HTTPS. Open the secure version of this site.";
  }
  if (typeof navigator === "undefined" || typeof navigator.mediaDevices?.getUserMedia !== "function") {
    return "This browser cannot access the camera and microphone. Open this page in an up-to-date Chrome, Edge, Firefox or Safari browser.";
  }
  if (typeof RTCPeerConnection !== "function" || typeof RTCRtpSender === "undefined" ||
      typeof RTCRtpSender.prototype.replaceTrack !== "function") {
    return "This browser does not support video calls. Open this page in an up-to-date Chrome, Edge, Firefox or Safari browser.";
  }
  return null;
}

/** Replace only the camera on the existing sender and stream; never renegotiate. */
export async function switchCallCamera({
  stream,
  facingMode,
  previousFacingMode,
  getPeerConnection,
  isActive,
}: SwitchCallCameraOptions): Promise<CameraFacingMode> {
  const previousTrack = stream.getVideoTracks()[0];
  if (!previousTrack) throw new Error("No camera track is available.");
  const previousSettings = previousTrack.getSettings();
  const size = {
    width: { ideal: Math.min(previousSettings.width || 1280, 1280), max: 1280 },
    height: { ideal: Math.min(previousSettings.height || 720, 720), max: 720 },
    frameRate: { ideal: Math.min(previousSettings.frameRate || 30, 30), max: 30 },
  };
  let replacement: MediaStreamTrack | null = null;

  const ensureActive = () => {
    if (!isActive()) throw new DOMException("Call has ended.", "AbortError");
  };

  const acquire = async (selection: MediaTrackConstraints) => {
    ensureActive();
    let acquired: MediaStream;
    try {
      acquired = await navigator.mediaDevices.getUserMedia({ audio: false, video: { ...size, ...selection } });
    } catch (error) {
      // Relax dimensions on older cameras, but keep the exact camera selection.
      if (errorName(error) !== "OverconstrainedError" ||
          !["width", "height", "frameRate"].includes((error as OverconstrainedError).constraint)) {
        throw error;
      }
      ensureActive();
      acquired = await navigator.mediaDevices.getUserMedia({ audio: false, video: selection });
    }
    const track = acquired.getVideoTracks()[0];
    acquired.getTracks().forEach((item) => { if (item !== track) item.stop(); });
    if (!isActive() || !track) {
      track?.stop();
      ensureActive();
      throw new Error("The selected camera is unavailable.");
    }
    return track;
  };

  const attach = async (track: MediaStreamTrack) => {
    ensureActive();
    // Read the current toggle state after acquisition, including taps during a flip.
    track.enabled = previousTrack.enabled;
    const pc = getPeerConnection();
    if (pc) {
      if (pc.signalingState === "closed") throw new DOMException("Call has ended.", "AbortError");
      const sender = pc.getSenders().find((item) => item.track === previousTrack || item.track?.kind === "video");
      if (!sender) throw new Error("The call's video sender is unavailable.");
      try {
        await sender.replaceTrack(track);
      } catch (error) {
        if (errorName(error) !== "InvalidModificationError") throw error;
        // Stay within the dimensions/frame rate used by the negotiated camera.
        await track.applyConstraints({
          width: { ideal: previousSettings.width || 640, max: previousSettings.width || 640 },
          height: { ideal: previousSettings.height || 480, max: previousSettings.height || 480 },
          frameRate: { ideal: Math.min(previousSettings.frameRate || 30, 30), max: Math.min(previousSettings.frameRate || 30, 30) },
        });
        ensureActive();
        await sender.replaceTrack(track);
      }
    }
    ensureActive();
    track.enabled = previousTrack.enabled;
    stream.removeTrack(previousTrack);
    stream.addTrack(track);
    previousTrack.stop();
  };

  const selectDevice = async (): Promise<MediaTrackConstraints> => {
    const cameras = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "videoinput" && device.deviceId);
    ensureActive();
    const direction = facingMode === "environment" ? /\b(back|rear|environment|world)\b/i : /\b(front|user|facetime)\b/i;
    const candidates = cameras.filter((device) => device.deviceId !== previousSettings.deviceId);
    const camera = candidates.find((device) => direction.test(device.label)) ||
      (previousSettings.deviceId && cameras.length === 2 ? candidates[0] : undefined);
    if (!camera) throw new Error("No other camera is available.");
    return { deviceId: { exact: camera.deviceId } };
  };

  const acquireSelected = async (selection: MediaTrackConstraints) => {
    try {
      return await acquire(selection);
    } catch (error) {
      // Some mobile devices cannot open both cameras at once. Release only video.
      if (!["NotReadableError", "TrackStartError", "AbortError"].includes(errorName(error)) || !isActive()) throw error;
      previousTrack.stop();
      return acquire(selection);
    }
  };

  try {
    let selection: MediaTrackConstraints = { facingMode: { exact: facingMode } };
    if (!navigator.mediaDevices.getSupportedConstraints?.().facingMode) {
      selection = await selectDevice();
    }

    try {
      replacement = await acquireSelected(selection);
    } catch (error) {
      // Some browsers advertise facingMode support but do not map it to cameras.
      if (!selection.facingMode || errorName(error) !== "OverconstrainedError" ||
          !["facingMode", ""].includes((error as OverconstrainedError).constraint || "")) throw error;
      try {
        selection = await selectDevice();
      } catch {
        throw error;
      }
      replacement = await acquireSelected(selection);
    }
    let settings = replacement.getSettings();
    if (selection.facingMode &&
        ((settings.facingMode && settings.facingMode !== facingMode) ||
         (!settings.facingMode && settings.deviceId && settings.deviceId === previousSettings.deviceId))) {
      replacement.stop();
      selection = await selectDevice();
      replacement = await acquireSelected(selection);
      settings = replacement.getSettings();
    }
    if ((settings.facingMode && settings.facingMode !== facingMode) ||
        (!settings.facingMode && settings.deviceId && settings.deviceId === previousSettings.deviceId)) {
      throw new Error("The selected camera is unavailable.");
    }
    await attach(replacement);
    return settings.facingMode === "user" || settings.facingMode === "environment" ? settings.facingMode : facingMode;
  } catch (error) {
    replacement?.stop();
    if ((previousTrack.readyState === "ended" || previousTrack.muted) && isActive()) {
      // Restore the original camera if switching failed after hardware release.
      previousTrack.stop();
      let restored: MediaStreamTrack | null = null;
      try {
        restored = await acquire(previousSettings.deviceId
          ? { deviceId: { exact: previousSettings.deviceId } }
          : { facingMode: { exact: previousFacingMode } });
        await attach(restored);
      } catch {
        restored?.stop();
      }
    }
    throw error;
  }
}

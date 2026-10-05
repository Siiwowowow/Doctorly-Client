import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/lib/call-camera.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;

function track(kind, facingMode = "user", enabled = true) {
  return {
    kind, enabled, readyState: "live", stopped: 0,
    getSettings: () => ({ facingMode, deviceId: facingMode, width: 1280, height: 720, frameRate: 30 }),
    stop() { this.readyState = "ended"; this.stopped++; },
    async applyConstraints(constraints) { this.constraints = constraints; },
  };
}

function stream(...tracks) {
  return {
    getTracks: () => [...tracks],
    getVideoTracks: () => tracks.filter((item) => item.kind === "video"),
    getAudioTracks: () => tracks.filter((item) => item.kind === "audio"),
    removeTrack(item) { tracks = tracks.filter((candidate) => candidate !== item); },
    addTrack(item) { tracks.push(item); },
  };
}

function setup(acquire, { enabled = true, supportsFacing = true } = {}) {
  const mic = track("audio", undefined, false);
  const front = track("video", "user", enabled);
  const local = stream(mic, front);
  const calls = [];
  const exports = {};
  const mediaDevices = {
    getSupportedConstraints: () => ({ facingMode: supportsFacing }),
    enumerateDevices: async () => [{ kind: "videoinput", deviceId: "user" }, { kind: "videoinput", deviceId: "environment" }],
    async getUserMedia(constraints) { calls.push(constraints); return acquire(constraints, front); },
  };
  vm.runInNewContext(compiled, { exports, navigator: { mediaDevices }, DOMException, Error });
  const videoSender = {
    track: front, replacements: [],
    async replaceTrack(next) { this.replacements.push(next); this.track = next; },
  };
  const audioSender = { track: mic, replaceTrack() { assert.fail("Microphone must never be replaced"); } };
  const pc = { signalingState: "stable", getSenders: () => [audioSender, videoSender] };
  let active = true;
  const flip = (facingMode = "environment", previousFacingMode = "user") => exports.switchCallCamera({
    stream: local, facingMode, previousFacingMode, getPeerConnection: () => pc, isActive: () => active,
  });
  return { flip, mic, front, local, pc, videoSender, calls, mediaDevices, deactivate() { active = false; } };
}

function cameraError(name, constraint) {
  const error = new Error(name);
  error.name = name;
  if (constraint) error.constraint = constraint;
  return error;
}

test("repeated front/back switches reuse the stream/sender and preserve muted audio and camera", async () => {
  const acquired = [];
  const ctx = setup(({ video }) => {
    const next = track("video", video.facingMode.exact);
    acquired.push(next);
    return stream(next);
  }, { enabled: false });
  for (let i = 0; i < 8; i++) {
    const next = i % 2 === 0 ? "environment" : "user";
    assert.equal(await ctx.flip(next, next === "user" ? "environment" : "user"), next);
    assert.equal(ctx.videoSender.track, acquired[i]);
    assert.equal(ctx.local.getVideoTracks()[0], acquired[i]);
    assert.equal(acquired[i].enabled, false);
    assert.equal(ctx.local.getAudioTracks()[0], ctx.mic);
    assert.equal(ctx.mic.readyState, "live");
    assert.equal(ctx.mic.enabled, false);
  }
  assert.ok(ctx.calls.every((call) => call.audio === false));
  assert.ok(acquired.slice(0, -1).every((item) => item.readyState === "ended"));
});

test("old camera remains live until replacement succeeds", async () => {
  const back = track("video", "environment");
  const ctx = setup(() => stream(back));
  ctx.videoSender.replaceTrack = async function(next) {
    assert.equal(ctx.front.readyState, "live");
    assert.equal(ctx.local.getVideoTracks()[0], ctx.front);
    this.track = next;
  };
  await ctx.flip();
  assert.equal(ctx.front.readyState, "ended");
});

test("mobile exclusive-camera hardware releases only video then retries", async () => {
  const back = track("video", "environment");
  let count = 0;
  const ctx = setup((_, old) => {
    if (++count === 1) throw cameraError("NotReadableError");
    assert.equal(old.readyState, "ended");
    return stream(back);
  });
  await ctx.flip();
  assert.equal(ctx.videoSender.track, back);
  assert.equal(ctx.mic.stopped, 0);
  assert.equal(ctx.calls.length, 2);
});

test("missing rear camera leaves the original video and audio running", async () => {
  const ctx = setup(() => { throw cameraError("OverconstrainedError", "facingMode"); });
  ctx.mediaDevices.enumerateDevices = async () => [{ kind: "videoinput", deviceId: "user" }];
  await assert.rejects(ctx.flip(), { name: "OverconstrainedError" });
  assert.equal(ctx.front.readyState, "live");
  assert.equal(ctx.videoSender.track, ctx.front);
  assert.equal(ctx.mic.stopped, 0);
  assert.equal(ctx.calls.length, 1);
});

test("failure after releasing mobile camera restores the previous device", async () => {
  const restored = track("video", "user");
  const ctx = setup(({ video }) => {
    if (video.deviceId?.exact === "user") return stream(restored);
    throw cameraError("NotReadableError");
  }, { enabled: false });
  await assert.rejects(ctx.flip(), { name: "NotReadableError" });
  assert.equal(ctx.videoSender.track, restored);
  assert.equal(ctx.local.getVideoTracks()[0], restored);
  assert.equal(restored.enabled, false);
  assert.equal(ctx.mic.stopped, 0);
});

test("sender rejection disposes new camera and retains original sender", async () => {
  const back = track("video", "environment");
  const ctx = setup(() => stream(back));
  ctx.videoSender.replaceTrack = async () => { throw cameraError("InvalidStateError"); };
  await assert.rejects(ctx.flip(), { name: "InvalidStateError" });
  assert.equal(back.readyState, "ended");
  assert.equal(ctx.front.readyState, "live");
  assert.equal(ctx.videoSender.track, ctx.front);
});

test("negotiated-envelope mismatch retries replacement at previous dimensions", async () => {
  const back = track("video", "environment");
  const ctx = setup(() => stream(back));
  let count = 0;
  ctx.videoSender.replaceTrack = async function(next) {
    if (++count === 1) throw cameraError("InvalidModificationError");
    this.track = next;
  };
  await ctx.flip();
  assert.equal(count, 2);
  assert.equal(back.constraints.width.max, 1280);
  assert.equal(back.constraints.frameRate.max, 30);
  assert.equal(ctx.videoSender.track, back);
});

test("dimension fallback keeps exact facing selection", async () => {
  const back = track("video", "environment");
  let count = 0;
  const ctx = setup(({ video }) => {
    assert.equal(video.facingMode.exact, "environment");
    if (++count === 1) throw cameraError("OverconstrainedError", "width");
    assert.equal(video.width, undefined);
    return stream(back);
  });
  await ctx.flip();
  assert.equal(count, 2);
});

test("ending a call during camera acquisition stops late tracks without replacing sender", async () => {
  let resolve;
  const back = track("video", "environment");
  const ctx = setup(() => new Promise((done) => { resolve = done; }));
  const pending = ctx.flip();
  ctx.deactivate();
  resolve(stream(back));
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(back.readyState, "ended");
  assert.equal(ctx.videoSender.replacements.length, 0);
});

test("ending during replaceTrack does not publish the acquired camera", async () => {
  const back = track("video", "environment");
  const ctx = setup(() => stream(back));
  ctx.videoSender.replaceTrack = async () => { ctx.deactivate(); };
  await assert.rejects(ctx.flip(), { name: "AbortError" });
  assert.equal(back.readyState, "ended");
  assert.equal(ctx.local.getVideoTracks()[0], ctx.front);
});

test("video toggle during acquisition is preserved", async () => {
  let resolve;
  const back = track("video", "environment");
  const ctx = setup(() => new Promise((done) => { resolve = done; }));
  const pending = ctx.flip();
  ctx.front.enabled = false;
  resolve(stream(back));
  await pending;
  assert.equal(back.enabled, false);
});

test("browsers without facingMode select another camera by deviceId", async () => {
  const back = track("video", "environment");
  const ctx = setup(({ video }) => {
    assert.equal(video.deviceId.exact, "environment");
    return stream(back);
  }, { supportsFacing: false });
  await ctx.flip();
  assert.equal(ctx.videoSender.track, back);
});

test("silently selecting the same camera does not claim a successful flip", async () => {
  const wrong = track("video", "user");
  const ctx = setup(() => stream(wrong));
  await assert.rejects(ctx.flip(), /selected camera is unavailable/);
  assert.equal(ctx.front.readyState, "live");
  assert.equal(wrong.readyState, "ended");
});

test("failure to restore camera still preserves microphone and disposes acquired tracks", async () => {
  const ctx = setup(() => { throw cameraError("NotReadableError"); });
  await assert.rejects(ctx.flip(), { name: "NotReadableError" });
  assert.equal(ctx.mic.readyState, "live");
  assert.equal(ctx.mic.enabled, false);
});

test("DOM-style errors that are not Error instances still release exclusive-camera hardware", async () => {
  const back = track("video", "environment");
  let count = 0;
  const ctx = setup(() => {
    if (++count === 1) throw { name: "NotReadableError" };
    return stream(back);
  });
  await ctx.flip();
  assert.equal(count, 2);
  assert.equal(ctx.videoSender.track, back);
  assert.equal(ctx.mic.stopped, 0);
});

test("advertised facingMode support falls back to an exact deviceId", async () => {
  const back = track("video", "environment");
  const ctx = setup(({ video }) => {
    if (video.facingMode) throw { name: "OverconstrainedError", constraint: "facingMode" };
    assert.equal(video.deviceId.exact, "environment");
    return stream(back);
  });
  await ctx.flip();
  assert.equal(ctx.calls.length, 2);
  assert.equal(ctx.videoSender.track, back);
});

test("silently ignored facingMode retries a different camera by deviceId", async () => {
  const wrong = track("video", "user");
  const back = track("video", "environment");
  const ctx = setup(({ video }) => stream(video.deviceId ? back : wrong));
  await ctx.flip();
  assert.equal(wrong.readyState, "ended");
  assert.equal(ctx.videoSender.track, back);
  assert.equal(ctx.front.readyState, "ended");
});

test("multi-lens phones prefer a labelled rear camera rather than another front lens", async () => {
  const back = track("video", "environment");
  const ctx = setup(({ video }) => {
    assert.equal(video.deviceId.exact, "rear-wide");
    return stream(back);
  }, { supportsFacing: false });
  ctx.mediaDevices.enumerateDevices = async () => [
    { kind: "videoinput", deviceId: "user", label: "Front Camera" },
    { kind: "videoinput", deviceId: "front-depth", label: "Front Depth Camera" },
    { kind: "videoinput", deviceId: "rear-wide", label: "Back Camera" },
    { kind: "videoinput", deviceId: "rear-tele", label: "Back Telephoto Camera" },
  ];
  await ctx.flip();
  assert.equal(ctx.videoSender.track, back);
});

test("older browsers without getSupportedConstraints still select by deviceId", async () => {
  const back = track("video", "environment");
  const ctx = setup(({ video }) => {
    assert.equal(video.deviceId.exact, "environment");
    return stream(back);
  });
  delete ctx.mediaDevices.getSupportedConstraints;
  await ctx.flip();
  assert.equal(ctx.videoSender.track, back);
});

test("denied device enumeration never stops a functioning camera", async () => {
  const ctx = setup(() => { throw new Error("Acquisition must not run"); }, { supportsFacing: false });
  ctx.mediaDevices.enumerateDevices = async () => { throw cameraError("NotAllowedError"); };
  await assert.rejects(ctx.flip(), { name: "NotAllowedError" });
  assert.equal(ctx.front.readyState, "live");
  assert.equal(ctx.videoSender.replacements.length, 0);
});

test("a Safari-style muted original camera is restored if new-camera attachment fails", async () => {
  const back = track("video", "environment");
  const restored = track("video", "user");
  const ctx = setup(({ video }, old) => {
    if (video.deviceId?.exact === "user") return stream(restored);
    old.muted = true;
    return stream(back);
  });
  ctx.videoSender.replaceTrack = async function(next) {
    if (next === back) throw cameraError("InvalidStateError");
    this.track = next;
  };
  await assert.rejects(ctx.flip(), { name: "InvalidStateError" });
  assert.equal(back.readyState, "ended");
  assert.equal(ctx.videoSender.track, restored);
  assert.equal(ctx.mic.stopped, 0);
});

function supportError(globals) {
  const exports = {};
  vm.runInNewContext(compiled, { exports, ...globals });
  return exports.getCallMediaSupportError();
}

const supportedGlobals = {
  window: { isSecureContext: true },
  navigator: { mediaDevices: { getUserMedia() {} } },
  RTCPeerConnection: function() {},
  RTCRtpSender: class { replaceTrack() {} },
};

test("secure browsers with modern WebRTC APIs pass the feature check", () => {
  assert.equal(supportError(supportedGlobals), null);
});

test("insecure origins get a useful HTTPS error before requesting media", () => {
  assert.match(supportError({ ...supportedGlobals, window: { isSecureContext: false } }), /requires HTTPS/);
});

test("embedded browsers without camera access get a useful browser error", () => {
  assert.match(supportError({ ...supportedGlobals, navigator: {} }), /cannot access the camera/);
});

test("browsers without replaceTrack do not enter a broken video call", () => {
  assert.match(supportError({ ...supportedGlobals, RTCRtpSender: class {} }), /does not support video calls/);
});

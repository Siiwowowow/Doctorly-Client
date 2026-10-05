// Run with node tests/call-camera.browser.mjs. Install playwright-core separately
// and set CAMERA_TEST_PLAYWRIGHT_PATH to its module path if it is not local.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const engines = require(process.env.CAMERA_TEST_PLAYWRIGHT_PATH || "playwright-core");
const engine = process.env.CAMERA_TEST_ENGINE || "chromium";
const profile = process.env.CAMERA_TEST_PROFILE || "desktop";
if (!["chromium", "firefox", "webkit"].includes(engine)) throw new Error(`Unknown browser engine: ${engine}`);
const source = readFileSync(new URL("../src/lib/call-camera.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const server = createServer((_, response) => response.end("<!doctype html><html><body></body></html>"));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await engines[engine].launch({
    ...(process.env.CAMERA_TEST_BROWSER ? { executablePath: process.env.CAMERA_TEST_BROWSER } : engine === "chromium" ? { channel: process.env.CAMERA_TEST_CHANNEL || "chrome" } : {}),
    headless: true,
    ...(engine === "chromium" ? { args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"] } : {}),
    ...(engine === "firefox" ? { firefoxUserPrefs: { "media.navigator.streams.fake": true, "media.navigator.permission.disabled": true, "media.autoplay.default": 0 } } : {}),
  });
  const page = await browser.newPage(profile === "desktop" ? {} : {
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    ...(engine !== "firefox" ? { isMobile: true } : {}),
  });
  await page.goto(`http://127.0.0.1:${server.address().port}`);
  const features = await page.evaluate(() => ({
    peerConnection: typeof RTCPeerConnection === "function",
    replaceTrack: typeof globalThis.RTCRtpSender?.prototype.replaceTrack === "function",
    mediaCapture: typeof navigator.mediaDevices?.getUserMedia === "function",
    canvasCapture: typeof HTMLCanvasElement.prototype.captureStream === "function",
  }));
  assert.ok(Object.values(features).every(Boolean), `Required browser test APIs unavailable: ${JSON.stringify(features)}`);
  await page.addScriptTag({ content: `window.exports = {};\n${compiled}` });
  const result = await page.evaluate(async () => {
    const check = (condition, message) => { if (!condition) throw new Error(message); };
    const waitFor = async (predicate, message) => {
      const deadline = performance.now() + 10000;
      while (!predicate()) {
        if (performance.now() > deadline) throw new Error(message);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    };
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
    const acquired = [];
    const timers = [];
    const makeCamera = (facingMode) => {
      const canvas = document.createElement("canvas");
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext("2d");
      const draw = () => {
        ctx.fillStyle = facingMode === "user" ? "rgb(240, 10, 10)" : "rgb(10, 10, 240)";
        ctx.fillRect(0, 0, 320, 240);
      };
      draw();
      timers.push(setInterval(draw, 33));
      const stream = canvas.captureStream(30);
      const track = stream.getVideoTracks()[0];
      const getSettings = track.getSettings.bind(track);
      track.getSettings = () => ({ ...getSettings(), facingMode, deviceId: facingMode });
      acquired.push(track);
      return stream;
    };
    const requests = [];
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      requests.push(constraints);
      check(constraints.audio === false, "A flip requested microphone access");
      return makeCamera(constraints.video.facingMode.exact);
    };

    const peers = [new RTCPeerConnection(), new RTCPeerConnection()];
    const audioStreams = await Promise.all([originalGetUserMedia({ audio: true }), originalGetUserMedia({ audio: true })]);
    const locals = audioStreams.map((audio) => new MediaStream([...audio.getTracks(), ...makeCamera("user").getTracks()]));
    const micTracks = locals.map((stream) => stream.getAudioTracks()[0]);
    // One participant starts muted. That state must survive every switch.
    micTracks[0].enabled = false;
    const videoSenders = [];
    const remotes = [];
    const queued = [[], []];
    const iceErrors = [];
    let negotiations = 0;
    for (let i = 0; i < 2; i++) {
      const video = document.createElement("video");
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      document.body.append(video);
      remotes[i] = video;
      peers[i].ontrack = (event) => {
        video.srcObject = event.streams[0];
        video.play().catch(() => {});
      };
      peers[i].onnegotiationneeded = () => { negotiations++; };
      peers[i].onicecandidate = (event) => {
        if (!event.candidate) return;
        const other = 1 - i;
        if (peers[other].remoteDescription) peers[other].addIceCandidate(event.candidate).catch((error) => iceErrors.push(error.message));
        else queued[other].push(event.candidate);
      };
      for (const track of locals[i].getTracks()) {
        const sender = peers[i].addTrack(track, locals[i]);
        if (track.kind === "video") videoSenders[i] = sender;
      }
    }
    await peers[0].setLocalDescription(await peers[0].createOffer());
    await peers[1].setRemoteDescription(peers[0].localDescription);
    await peers[1].setLocalDescription(await peers[1].createAnswer());
    await peers[0].setRemoteDescription(peers[1].localDescription);
    for (let i = 0; i < 2; i++) for (const candidate of queued[i]) await peers[i].addIceCandidate(candidate);
    await waitFor(() => peers.every((pc) => pc.connectionState === "connected") && remotes.every((video) => video.readyState >= 2), "Two-way media did not connect");

    const sample = (video) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data];
    };
    const matches = (index, mode) => {
      const pixel = sample(remotes[1 - index]);
      return mode === "user" ? pixel[0] > 150 && pixel[2] < 80 : pixel[2] > 150 && pixel[0] < 80;
    };
    await waitFor(() => matches(0, "user") && matches(1, "user"), "Initial video pixels missing");
    const initialNegotiations = negotiations;
    const receiverIds = remotes.map((video) => video.srcObject.getVideoTracks()[0].id);
    const descriptions = peers.map((pc) => pc.localDescription.sdp);
    let modes = ["user", "user"];
    let flips = 0;
    const flip = async (index) => {
      const next = modes[index] === "user" ? "environment" : "user";
      modes[index] = await window.exports.switchCallCamera({
        stream: locals[index], facingMode: next, previousFacingMode: modes[index],
        getPeerConnection: () => peers[index], isActive: () => true,
      });
      flips++;
    };
    // Each participant flips independently, then both flip simultaneously.
    for (let i = 0; i < 4; i++) {
      await flip(0);
      await waitFor(() => matches(0, modes[0]) && matches(1, modes[1]), "Caller flip interrupted two-way video");
      await flip(1);
      await waitFor(() => matches(0, modes[0]) && matches(1, modes[1]), "Callee flip interrupted two-way video");
    }
    for (let i = 0; i < 4; i++) {
      await Promise.all([flip(0), flip(1)]);
      await waitFor(() => matches(0, modes[0]) && matches(1, modes[1]), "Simultaneous flips interrupted video");
    }
    check(negotiations === initialNegotiations, "Camera switching triggered renegotiation");
    check(iceErrors.length === 0, `ICE errors: ${iceErrors.join(", ")}`);
    for (let i = 0; i < 2; i++) {
      check(peers[i].connectionState === "connected", "Peer connection was interrupted");
      check(peers[i].getSenders().length === 2, "Duplicate media senders appeared");
      check(videoSenders[i].track === locals[i].getVideoTracks()[0], "Sender did not follow camera");
      check(locals[i].getAudioTracks()[0] === micTracks[i] && micTracks[i].readyState === "live", "Microphone was replaced/stopped");
      check(micTracks[i].enabled === (i === 1), "Mute state changed");
      check(remotes[i].srcObject.getVideoTracks()[0].id === receiverIds[i], "Remote video track changed");
      check(peers[i].localDescription.sdp === descriptions[i], "Camera switching changed SDP");
    }
    const stats = await Promise.all(peers.map(async (pc) => {
      const stats = [...(await pc.getStats()).values()];
      return stats.filter((item) => item.type === "inbound-rtp").map((item) => ({ kind: item.kind, packetsReceived: item.packetsReceived, framesDecoded: item.framesDecoded }));
    }));
    check(stats.every((items) => items.some((item) => item.kind === "video" && item.framesDecoded > 0) && items.some((item) => item.kind === "audio" && item.packetsReceived > 0)), "Bidirectional RTP audio/video did not arrive");
    peers.forEach((pc) => pc.close());
    locals.forEach((stream) => stream.getTracks().forEach((track) => track.stop()));
    acquired.forEach((track) => track.stop());
    timers.forEach(clearInterval);
    return { flips, renegotiationsDuringSwitch: negotiations - initialNegotiations, stats };
  });
  assert.equal(result.flips, 16);
  assert.equal(result.renegotiationsDuringSwitch, 0);
  console.log(JSON.stringify({ engine, browserVersion: browser.version(), profile, ...result }, null, 2));
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}

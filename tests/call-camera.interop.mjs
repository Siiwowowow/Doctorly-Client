// Real Chrome <-> Firefox WebRTC with generated cameras and browser mock microphones.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { chromium, firefox } = require(process.env.CAMERA_TEST_PLAYWRIGHT_PATH || "playwright-core");
const compiled = ts.transpileModule(readFileSync(new URL("../src/lib/call-camera.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const server = createServer((_, response) => response.end("<!doctype html><html><body></body></html>"));
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const browsers = [];
try {
  browsers.push(await chromium.launch({ channel: "chrome", headless: true, args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required"] }));
  browsers.push(await firefox.launch({ headless: true, firefoxUserPrefs: { "media.navigator.streams.fake": true, "media.navigator.permission.disabled": true, "media.autoplay.default": 0 } }));
  const pages = await Promise.all(browsers.map((browser) => browser.newPage()));
  for (const page of pages) {
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.addScriptTag({ content: `window.exports = {};\n${compiled}` });
    await page.evaluate(async () => {
      const supportError = window.exports.getCallMediaSupportError();
      if (supportError) throw new Error(supportError);
      const mic = (await navigator.mediaDevices.getUserMedia({ audio: true })).getAudioTracks()[0];
      const cameras = [];
      const timers = [];
      const camera = (mode) => {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        const draw = () => {
          ctx.fillStyle = mode === "user" ? "rgb(240,10,10)" : "rgb(10,10,240)";
          ctx.fillRect(0, 0, 320, 240);
        };
        draw();
        timers.push(setInterval(draw, 33));
        const track = canvas.captureStream(30).getVideoTracks()[0];
        const getSettings = track.getSettings.bind(track);
        track.getSettings = () => ({ ...getSettings(), facingMode: mode, deviceId: mode });
        cameras.push(track);
        return track;
      };
      navigator.mediaDevices.getUserMedia = async ({ audio, video }) => {
        if (audio !== false) throw new Error("A flip requested microphone access");
        return new MediaStream([camera(video.facingMode.exact)]);
      };
      const stream = new MediaStream([mic, camera("user")]);
      const pc = new RTCPeerConnection();
      pc.addTrack(mic, stream);
      const sender = pc.addTrack(stream.getVideoTracks()[0], stream);
      const video = document.createElement("video");
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      document.body.append(video);
      pc.ontrack = (event) => { video.srcObject = event.streams[0]; video.play().catch(() => {}); };
      const state = { pc, stream, mic, sender, video, mode: "user", negotiations: 0, initialNegotiations: 0, cameras, timers };
      pc.onnegotiationneeded = () => { state.negotiations++; };
      window.peerTest = state;
    });
  }
  const offer = await pages[0].evaluate(async () => {
    const pc = window.peerTest.pc;
    await pc.setLocalDescription(await pc.createOffer());
    await new Promise((resolve, reject) => {
      if (pc.iceGatheringState === "complete") return resolve();
      const timer = setTimeout(() => reject(new Error("Offer ICE gathering timed out")), 10000);
      pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(timer); resolve(); } };
    });
    return pc.localDescription.toJSON();
  });
  const answer = await pages[1].evaluate(async (offer) => {
    const pc = window.peerTest.pc;
    await pc.setRemoteDescription(offer);
    await pc.setLocalDescription(await pc.createAnswer());
    await new Promise((resolve, reject) => {
      if (pc.iceGatheringState === "complete") return resolve();
      const timer = setTimeout(() => reject(new Error("Answer ICE gathering timed out")), 10000);
      pc.onicegatheringstatechange = () => { if (pc.iceGatheringState === "complete") { clearTimeout(timer); resolve(); } };
    });
    return pc.localDescription.toJSON();
  }, offer);
  await pages[0].evaluate((answer) => window.peerTest.pc.setRemoteDescription(answer), answer);

  const checkVideo = async (page, mode) => {
    await page.waitForFunction((mode) => {
      const { pc, video } = window.peerTest;
      if (pc.connectionState !== "connected" || video.readyState < 2) return false;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;
      return mode === "user" ? pixel[0] > 150 && pixel[2] < 80 : pixel[2] > 150 && pixel[0] < 80;
    }, mode, { timeout: 15000 });
  };
  await Promise.all(pages.map((page) => checkVideo(page, "user")));
  for (const page of pages) await page.evaluate(() => {
    const state = window.peerTest;
    state.initialNegotiations = state.negotiations;
    state.initialSDP = state.pc.localDescription.sdp;
    state.receiverId = state.video.srcObject.getVideoTracks()[0].id;
  });
  let modes = ["user", "user"];
  const flip = async (index) => {
    modes[index] = await pages[index].evaluate(async () => {
      const state = window.peerTest;
      state.mode = await window.exports.switchCallCamera({
        stream: state.stream, facingMode: state.mode === "user" ? "environment" : "user", previousFacingMode: state.mode,
        getPeerConnection: () => state.pc, isActive: () => true,
      });
      return state.mode;
    });
  };
  for (let i = 0; i < 4; i++) {
    await flip(0);
    await Promise.all([checkVideo(pages[0], modes[1]), checkVideo(pages[1], modes[0])]);
    await flip(1);
    await Promise.all([checkVideo(pages[0], modes[1]), checkVideo(pages[1], modes[0])]);
  }
  for (let i = 0; i < 4; i++) {
    await Promise.all([flip(0), flip(1)]);
    await Promise.all([checkVideo(pages[0], modes[1]), checkVideo(pages[1], modes[0])]);
  }
  const results = await Promise.all(pages.map((page) => page.evaluate(async () => {
    const state = window.peerTest;
    const stats = [...(await state.pc.getStats()).values()];
    return {
      connected: state.pc.connectionState === "connected",
      renegotiations: state.negotiations - state.initialNegotiations,
      stableSDP: state.pc.localDescription.sdp === state.initialSDP,
      stableReceiver: state.video.srcObject.getVideoTracks()[0].id === state.receiverId,
      stableMic: state.stream.getAudioTracks()[0] === state.mic && state.mic.readyState === "live",
      senders: state.pc.getSenders().length,
      decodedVideo: stats.some((item) => item.type === "inbound-rtp" && item.kind === "video" && item.framesDecoded > 0),
      receivedAudio: stats.some((item) => item.type === "inbound-rtp" && item.kind === "audio" && item.packetsReceived > 0),
    };
  })));
  for (const result of results) {
    assert.equal(result.renegotiations, 0);
    assert.equal(result.senders, 2);
    for (const key of ["connected", "stableSDP", "stableReceiver", "stableMic", "decodedVideo", "receivedAudio"]) assert.equal(result[key], true, key);
  }
  console.log(JSON.stringify({ browsers: browsers.map((browser) => browser.version()), pairing: "Chrome <-> Firefox", flips: 16, results }, null, 2));
} finally {
  await Promise.allSettled(browsers.map((browser) => browser.close()));
  await new Promise((resolve) => server.close(resolve));
}

// src/lib/webrtc.config.ts

/**
 * Production-ready WebRTC ICE Server configuration for Doctorly Telemedicine.
 * Dynamically resolves STUN and TURN configurations from environment variables
 * with production-grade fallback and multi-transport support (UDP, TCP, TLS turns:).
 */
const DEFAULT_STUN_SERVERS: RTCIceServer[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
  { urls: ['stun:global.stun.twilio.com:3478'] },
  { urls: ['stun:stun.relay.metered.ca:80'] },
];

const DEFAULT_FALLBACK_TURN_SERVERS: RTCIceServer[] = [
  {
    urls: [
      'turn:global.relay.metered.ca:80',
      'turn:global.relay.metered.ca:80?transport=tcp',
      'turn:global.relay.metered.ca:443',
      'turns:global.relay.metered.ca:443?transport=tcp',
    ],
    username: 'acb1a39f68319df913415b35',
    credential: 'fau3ppTnse3ATxoh',
  },
];

export function getIceServersConfig(serverIssuedIceServers: RTCIceServer[] = []): RTCConfiguration {
  const iceServers: RTCIceServer[] = [];

  // 1. If backend issued ICE servers, add them first
  if (serverIssuedIceServers.length > 0) {
    iceServers.push(...serverIssuedIceServers);
  }

  // 2. STUN Servers (Public Google & Twilio STUN + Custom Env)
  const envStun = process.env.NEXT_PUBLIC_WEBRTC_STUN_URL || process.env.NEXT_PUBLIC_STUN_SERVER;
  if (envStun) {
    const urls = envStun.split(',').map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) {
      iceServers.push({ urls });
    }
  }

  // Always include high-availability public STUN servers
  iceServers.push(...DEFAULT_STUN_SERVERS);

  // 3. TURN Servers (For symmetric NATs, cellular carriers, and enterprise firewalls)
  const envTurn = process.env.NEXT_PUBLIC_WEBRTC_TURN_URL || process.env.NEXT_PUBLIC_TURN_SERVER;
  const envTurnUser = process.env.NEXT_PUBLIC_WEBRTC_TURN_USERNAME || process.env.NEXT_PUBLIC_TURN_USERNAME;
  const envTurnCred = process.env.NEXT_PUBLIC_WEBRTC_TURN_CREDENTIAL || process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (envTurn && envTurnUser && envTurnCred) {
    const turnUrls = envTurn.split(',').map((s) => s.trim()).filter(Boolean);
    iceServers.push({
      urls: turnUrls,
      username: envTurnUser,
      credential: envTurnCred,
    });
  }

  // 4. Ensure at least one TURN relay is ALWAYS present!
  // Critical for cellular networks (4G/5G), Symmetric NAT, and CGNAT mobile carriers
  const hasTurnServer = iceServers.some((s) => {
    const urls = Array.isArray(s.urls) ? s.urls : [s.urls];
    return urls.some((u) => typeof u === 'string' && (u.startsWith('turn:') || u.startsWith('turns:')));
  });

  if (!hasTurnServer) {
    iceServers.push(...DEFAULT_FALLBACK_TURN_SERVERS);
  }

  return {
    iceServers,
    iceCandidatePoolSize: 0,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
  };
}

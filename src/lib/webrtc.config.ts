// src/lib/webrtc.config.ts

/**
 * Production-ready WebRTC ICE Server configuration for Doctorly Telemedicine.
 * Dynamically resolves STUN and TURN configurations from environment variables
 * with production-grade fallback and multi-transport support (UDP, TCP, TLS turns:).
 */
export function getIceServersConfig(): RTCConfiguration {
  const iceServers: RTCIceServer[] = [];

  // 1. STUN Servers (Public Google & Twilio STUN + Custom Env)
  const envStun = process.env.NEXT_PUBLIC_WEBRTC_STUN_URL || process.env.NEXT_PUBLIC_STUN_SERVER;
  if (envStun) {
    const urls = envStun.split(',').map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) {
      iceServers.push({ urls });
    }
  }

  // Always include high-availability public STUN servers
  iceServers.push(
    { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    { urls: ['stun:global.stun.twilio.com:3478'] }
  );

  // 2. TURN Servers (For symmetric NATs, cellular carriers, and enterprise firewalls)
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
  } else {
    // OpenRelay TURN Fallback for NAT/firewall traversal in development/testing across UDP, TCP, and TLS
    iceServers.push(
      {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      },
      {
        urls: 'turns:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject',
      }
    );
  }

  return {
    iceServers,
    iceCandidatePoolSize: 10,
    bundlePolicy: 'max-bundle',
    rtcpMuxPolicy: 'require',
  };
}

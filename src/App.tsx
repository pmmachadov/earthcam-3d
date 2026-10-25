import React, { useState } from 'react';
import { EarthGlobe } from './views/components/Globe/EarthGlobe';
import { INITIAL_WEBCAMS } from './models/mockWebcams';
import type { Webcam } from './models/webcam.types';

export const App: React.FC = () => {
  const [selectedWebcam, setSelectedWebcam] = useState<Webcam | null>(null);

  const handleWebcamSelect = (webcam: Webcam) => {
    setSelectedWebcam(webcam);
  };

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#030712',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Quick Status Pill */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: '9999px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#e2e8f0',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.02em',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 8px #22c55e',
          }}
        />
        <span>EARTHCAM 3D</span>
        <span style={{ color: '#64748b' }}>|</span>
        <span style={{ color: '#38bdf8' }}>{INITIAL_WEBCAMS.length} Live Feeds</span>
      </div>

      {/* 3D Globe Viewport */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        <EarthGlobe
          webcams={INITIAL_WEBCAMS}
          selectedWebcamId={selectedWebcam?.id}
          onWebcamSelect={handleWebcamSelect}
        />
      </div>

      {/* Temporary Click Feedback Notification */}
      {selectedWebcam && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '12px 24px',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span style={{ fontSize: '18px' }}>📍</span>
          <div>
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{selectedWebcam.title}</div>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              {selectedWebcam.city}, {selectedWebcam.country}
            </div>
          </div>
          <button
            onClick={() => setSelectedWebcam(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '8px',
              fontSize: '14px',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </main>
  );
};

export default App;

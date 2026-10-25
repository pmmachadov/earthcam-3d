import React, { useState } from 'react';
import { EarthGlobe } from './views/components/Globe/EarthGlobe';
import { WebcamModal } from './views/components/Player/WebcamModal';
import { INITIAL_WEBCAMS } from './models/mockWebcams';
import type { Webcam } from './models/webcam.types';

export const App: React.FC = () => {
  const [selectedWebcam, setSelectedWebcam] = useState<Webcam | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleWebcamSelect = (webcam: Webcam) => {
    setSelectedWebcam(webcam);
  };

  const handleToggleFavorite = (webcam: Webcam) => {
    setFavorites((prev) =>
      prev.includes(webcam.id) ? prev.filter((id) => id !== webcam.id) : [...prev, webcam.id]
    );
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
        {favorites.length > 0 && (
          <>
            <span style={{ color: '#64748b' }}>|</span>
            <span style={{ color: '#ef4444' }}>❤️ {favorites.length} saved</span>
          </>
        )}
      </div>

      {/* 3D Globe Viewport */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        <EarthGlobe
          webcams={INITIAL_WEBCAMS}
          selectedWebcamId={selectedWebcam?.id}
          onWebcamSelect={handleWebcamSelect}
        />
      </div>

      {/* Live Webcam Modal Video Player */}
      {selectedWebcam && (
        <WebcamModal
          webcam={selectedWebcam}
          isFavorite={favorites.includes(selectedWebcam.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedWebcam(null)}
        />
      )}
    </main>
  );
};

export default App;

import React from 'react';
import { EarthGlobe } from './views/components/Globe/EarthGlobe';

export const App: React.FC = () => {
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
      {/* 3D Globe Viewport */}
      <div style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        <EarthGlobe />
      </div>
    </main>
  );
};

export default App;

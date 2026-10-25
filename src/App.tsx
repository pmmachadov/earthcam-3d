import React, { useState, useMemo } from 'react';
import { Navbar } from './views/components/Header/Navbar';
import { WebcamCard } from './views/components/Card/WebcamCard';
import { WebcamModal } from './views/components/Player/WebcamModal';
import { INITIAL_WEBCAMS } from './models/mockWebcams';
import type { Webcam, WebcamCategory } from './models/webcam.types';
import { Trees, Heart } from 'lucide-react';

export const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WebcamCategory | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState<Webcam | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('earthcam_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleFavorite = (webcam: Webcam) => {
    setFavorites((prev) => {
      const updated = prev.includes(webcam.id)
        ? prev.filter((id) => id !== webcam.id)
        : [...prev, webcam.id];
      try {
        localStorage.setItem('earthcam_favorites', JSON.stringify(updated));
      } catch {
        // LocalStorage fallback
      }
      return updated;
    });
  };

  // Filter webcams by search term, category and favorites
  const filteredWebcams = useMemo(() => {
    return INITIAL_WEBCAMS.filter((cam) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        cam.title.toLowerCase().includes(term) ||
        cam.location.toLowerCase().includes(term) ||
        cam.state.toLowerCase().includes(term);

      const matchesCategory = selectedCategory === 'all' || cam.category === selectedCategory;
      const matchesFavorites = !onlyFavorites || favorites.includes(cam.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [searchTerm, selectedCategory, onlyFavorites, favorites]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#030712',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Sticky Header with Search & Filters */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          setOnlyFavorites(false);
        }}
        onlyFavorites={onlyFavorites}
        onToggleOnlyFavorites={() => setOnlyFavorites((prev) => !prev)}
        favoritesCount={favorites.length}
        totalCount={filteredWebcams.length}
      />

      {/* Main Content Grid */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {filteredWebcams.length === 0 ? (
          /* Empty Search State */
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              color: '#64748b',
            }}
          >
            {onlyFavorites ? (
              <>
                <Heart size={44} style={{ color: '#ef4444', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', color: '#cbd5e1', margin: 0 }}>No favorite cameras yet</h3>
                <p style={{ fontSize: '14px', maxWidth: '360px', margin: 0 }}>
                  Click the heart icon on any camera feed to save it to your personal watchlist.
                </p>
              </>
            ) : (
              <>
                <Trees size={44} style={{ opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', color: '#cbd5e1', margin: 0 }}>No cameras found</h3>
                <p style={{ fontSize: '14px', maxWidth: '360px', margin: 0 }}>
                  Try adjusting your search terms or clearing the selected category filter.
                </p>
              </>
            )}
          </div>
        ) : (
          /* Responsive Cards Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredWebcams.map((webcam) => (
              <WebcamCard
                key={webcam.id}
                webcam={webcam}
                isFavorite={favorites.includes(webcam.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={(cam) => setSelectedWebcam(cam)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Live Stream Player Modal */}
      {selectedWebcam && (
        <WebcamModal
          webcam={selectedWebcam}
          isFavorite={favorites.includes(selectedWebcam.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={() => setSelectedWebcam(null)}
        />
      )}
    </div>
  );
};

export default App;

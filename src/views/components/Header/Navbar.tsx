import React from 'react';
import type { WebcamCategory } from '../../../models/webcam.types';
import { Search, Heart, Trees, Radio } from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: WebcamCategory | 'all';
  onCategorySelect: (category: WebcamCategory | 'all') => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
  favoritesCount: number;
  totalCount: number;
}

const CATEGORIES: { label: string; value: WebcamCategory | 'all' }[] = [
  { label: 'All Cameras', value: 'all' },
  { label: 'Wildlife & Sanctuaries', value: 'wildlife' },
  { label: 'Beaches & Coasts', value: 'beach' },
  { label: 'Marine & Oceans', value: 'ocean' },
];

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  onlyFavorites,
  onToggleOnlyFavorites,
  favoritesCount,
  totalCount,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e293b',
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Top Brand Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <Trees size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>
                US Wildlife & Coastal <span style={{ color: '#38bdf8' }}>Live</span>
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.4)',
                  borderRadius: '9999px',
                  color: '#22c55e',
                  fontSize: '9px',
                  fontWeight: 700,
                }}
              >
                <Radio size={9} />
                24/7 LIVE
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Real-time nature, beach and wildlife cameras across the United States
            </p>
          </div>
        </div>

        {/* Search Bar Input */}
        <div
          style={{
            position: 'relative',
            flex: '1',
            maxWidth: '420px',
            minWidth: '240px',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
            }}
          />
          <input
            type="text"
            placeholder="Search US locations, bears, otters, eagles, beaches..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '10px',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#38bdf8')}
            onBlur={(e) => (e.target.style.borderColor = '#1e293b')}
          />
        </div>

        {/* Favorites Counter & Filter Toggle */}
        <button
          onClick={onToggleOnlyFavorites}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: onlyFavorites ? 'rgba(239, 68, 68, 0.15)' : '#0f172a',
            border: onlyFavorites ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #1e293b',
            borderRadius: '10px',
            color: onlyFavorites ? '#ef4444' : '#94a3b8',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Heart size={16} fill={onlyFavorites ? '#ef4444' : 'none'} />
          <span>Favorites</span>
          <span
            style={{
              padding: '2px 6px',
              borderRadius: '9999px',
              backgroundColor: onlyFavorites ? '#ef4444' : '#1e293b',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {favoritesCount}
          </span>
        </button>
      </div>

      {/* Categories Filter Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '2px',
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.value && !onlyFavorites;
          return (
            <button
              key={cat.value}
              onClick={() => onCategorySelect(cat.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#38bdf8' : '#0f172a',
                color: isActive ? '#030712' : '#94a3b8',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.label}
            </button>
          );
        })}

        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
          Active Cams: <b>{totalCount}</b>
        </span>
      </div>
    </header>
  );
};

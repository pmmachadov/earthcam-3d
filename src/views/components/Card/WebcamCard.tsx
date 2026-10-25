import React from 'react';
import type { Webcam } from '../../../models/webcam.types';
import { Heart, MapPin, Eye, Play, Radio } from 'lucide-react';

interface WebcamCardProps {
  webcam: Webcam;
  isFavorite: boolean;
  onToggleFavorite: (webcam: Webcam) => void;
  onSelect: (webcam: Webcam) => void;
}

export const WebcamCard: React.FC<WebcamCardProps> = ({
  webcam,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <article
      onClick={() => onSelect(webcam)}
      style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #1e293b',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        e.currentTarget.style.boxShadow =
          '0 12px 24px -8px rgba(0, 0, 0, 0.6), 0 0 20px rgba(56, 189, 248, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = '#1e293b';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Thumbnail Banner */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%', // 16:9 ratio
          backgroundColor: '#020617',
          overflow: 'hidden',
        }}
      >
        <img
          src={webcam.thumbnailUrl}
          alt={webcam.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />

        {/* Gradient shadow overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 50%, rgba(15, 23, 42, 0.4) 100%)',
          }}
        />

        {/* Live Badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '3px 8px',
            backgroundColor: 'rgba(239, 68, 68, 0.85)',
            backdropFilter: 'blur(4px)',
            borderRadius: '9999px',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          <Radio size={11} />
          24/7 LIVE
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(webcam);
          }}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            border: isFavorite ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={16} fill={isFavorite ? '#ffffff' : 'none'} />
        </button>

        {/* Center Hover Play Icon */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(56, 189, 248, 0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#030712',
              boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)',
            }}
          >
            <Play size={18} fill="#030712" style={{ marginLeft: '2px' }} />
          </div>
        </div>
      </div>

      {/* Card Content Details */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span
            style={{
              textTransform: 'uppercase',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: '#38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {webcam.category}
          </span>

          {webcam.viewsCount && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '11px' }}>
              <Eye size={12} />
              <span>{webcam.viewsCount.toLocaleString()}</span>
            </div>
          )}
        </div>

        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#f8fafc',
            margin: 0,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {webcam.title}
        </h3>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#94a3b8',
            fontSize: '12px',
            marginTop: 'auto',
          }}
        >
          <MapPin size={13} style={{ color: '#38bdf8', flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {webcam.location}, {webcam.state}, USA
          </span>
        </div>
      </div>
    </article>
  );
};

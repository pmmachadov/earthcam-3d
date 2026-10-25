import React, { useEffect, useRef } from 'react';
import type { Webcam } from '../../../models/webcam.types';
import { X, Heart, MapPin, Eye, Radio } from 'lucide-react';
import Hls from 'hls.js';

interface WebcamModalProps {
  webcam: Webcam;
  isFavorite: boolean;
  onToggleFavorite: (webcam: Webcam) => void;
  onClose: () => void;
}

export const WebcamModal: React.FC<WebcamModalProps> = ({
  webcam,
  isFavorite,
  onToggleFavorite,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Load and play HLS (.m3u8) live stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(webcam.playerUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Handled browser autoplay policy with muted
          video.muted = true;
          video.play().catch(() => {});
        });
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari iOS/macOS HLS support
      video.src = webcam.playerUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [webcam.playerUrl]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        backgroundColor: 'rgba(3, 7, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '860px',
          backgroundColor: '#0f172a',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(56, 189, 248, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(51, 65, 85, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            {/* Live Indicator */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '9999px',
                color: '#ef4444',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                flexShrink: 0,
              }}
            >
              <Radio size={12} style={{ animation: 'pulse 1.5s infinite' }} />
              LIVE
            </div>

            <div style={{ minWidth: 0 }}>
              <h2
                style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  color: '#f8fafc',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {webcam.title}
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#94a3b8',
                  fontSize: '13px',
                  marginTop: '2px',
                }}
              >
                <MapPin size={13} style={{ color: '#38bdf8' }} />
                <span>
                  {webcam.city}, {webcam.state}, USA
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(webcam)}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{
                padding: '8px',
                backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.15)' : 'rgba(30, 41, 59, 0.7)',
                border: isFavorite ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #334155',
                borderRadius: '8px',
                color: isFavorite ? '#ef4444' : '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close (Esc)"
              style={{
                padding: '8px',
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video Player Frame with HLS support */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
            backgroundColor: '#020617',
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Modal Footer / Telemetry Bar */}
        <div
          style={{
            padding: '12px 20px',
            backgroundColor: '#090d16',
            borderTop: '1px solid rgba(51, 65, 85, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>
              Coordinates: {webcam.latitude.toFixed(4)}°, {webcam.longitude.toFixed(4)}°
            </span>
            <span
              style={{
                textTransform: 'capitalize',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                fontWeight: 500,
              }}
            >
              {webcam.category}
            </span>
            <span style={{ color: '#22c55e', fontWeight: 600 }}>• US DOT Public Feed</span>
          </div>

          {webcam.viewsCount && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} />
              <span>{webcam.viewsCount.toLocaleString()} views</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

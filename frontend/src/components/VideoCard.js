/* src/components/VideoCard.js — Individual video card in the grid */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatViews, timeAgo, placeholderColor } from '../utils/format';
import './VideoCard.css';

export default function VideoCard({ video }) {
  const [imgError, setImgError] = useState(false);

  // Fallback color when no thumbnail
  const fallbackColor = placeholderColor(video._id);

  return (
    <Link to={`/watch/${video._id}`} className="video-card">
      {/* Thumbnail */}
      <div className="video-card__thumb-wrap">
        {video.thumbnailUrl && !imgError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="video-card__thumb"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          /* Colourful placeholder when no thumbnail */
          <div
            className="video-card__thumb video-card__thumb--placeholder"
            style={{ background: fallbackColor }}
          >
            <PlayPlaceholder />
          </div>
        )}
        {/* Play overlay on hover */}
        <div className="video-card__play-overlay" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="20" fill="rgba(0,0,0,.55)"/>
            <polygon points="15,12 32,20 15,28" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Meta */}
      <div className="video-card__meta">
        {/* Uploader avatar */}
        <div
          className="video-card__avatar"
          style={{ background: fallbackColor }}
          aria-hidden="true"
        >
          {(video.uploaderName || video.uploader?.username || 'U').charAt(0).toUpperCase()}
        </div>

        <div className="video-card__info">
          <h3 className="video-card__title" title={video.title}>
            {video.title}
          </h3>
          <p className="video-card__channel">
            {video.uploaderName || video.uploader?.username || 'Unknown'}
          </p>
          <p className="video-card__stats">
            {formatViews(video.views || 0)} · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* Skeleton loader — shown while videos are fetching */
export function VideoCardSkeleton() {
  return (
    <div className="video-card video-card--skeleton" aria-hidden="true">
      <div className="video-card__thumb-wrap skeleton-box" />
      <div className="video-card__meta">
        <div className="video-card__avatar skeleton-box" />
        <div className="video-card__info">
          <div className="skeleton-box" style={{ height: '14px', marginBottom: '6px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ height: '12px', width: '60%', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}

const PlayPlaceholder = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.4">
    <polygon points="18,13 38,24 18,35" fill="white"/>
  </svg>
);

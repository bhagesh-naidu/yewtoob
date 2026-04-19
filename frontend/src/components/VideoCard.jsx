/* src/components/VideoCard.jsx */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatViews, timeAgo, placeholderColor } from '../utils/format';
import './VideoCard.css';

export default function VideoCard({ video }) {
  const [imgError, setImgError] = useState(false);

  const fallbackColor = placeholderColor(video._id);

  // Mocking duration and live badges to precisely reflect user image requirements
  const mockDuration = video.duration || '1:21:01'; 
  const isLive = video.tags?.includes('live') || false;

  return (
    <div className="video-card">
      <Link to={`/watch/${video._id}`} className="video-card__thumb-wrap">
        {video.thumbnailUrl && !imgError ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="video-card__thumb"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="video-card__thumb" style={{ background: fallbackColor }} />
        )}
        
        {isLive ? (
          <div className="video-card__live-badge">
            <LiveIcon /> LIVE
          </div>
        ) : (
          <div className="video-card__duration">{mockDuration}</div>
        )}
      </Link>

      <div className="video-card__meta">
        <Link to={`/channel/${video.uploader}`} className="video-card__avatar">
           {video.uploader?.avatar ? (
             <img src={video.uploader.avatar} alt="Channel avatar" />
           ) : (
             (video.uploaderName || video.uploader?.username || 'U').charAt(0).toUpperCase()
           )}
        </Link>
        <div className="video-card__info">
          <Link to={`/watch/${video._id}`} style={{textDecoration: 'none'}}>
            <h3 className="video-card__title" title={video.title}>{video.title}</h3>
          </Link>
          <Link to={`/channel/${video.uploader}`} className="video-card__channel" style={{textDecoration: 'none'}}>
            {video.uploaderName || video.uploader?.username || 'Unknown'} <VerifiedIcon />
          </Link>
          <p className="video-card__stats">
            {formatViews(video.views || 0)} views · {timeAgo(video.createdAt)}
          </p>
          <button className="video-card__options" aria-label="More actions">
            <DotsVerticalIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoCardSkeleton() {
  return (
    <div className="video-card" aria-hidden="true">
      <div className="video-card__thumb-wrap skeleton-box" style={{ borderRadius: '12px' }} />
      <div className="video-card__meta">
        <div className="video-card__avatar skeleton-box" />
        <div className="video-card__info">
          <div className="skeleton-box" style={{ height: '16px', marginBottom: '8px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ height: '16px', width: '80%', marginBottom: '8px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ height: '14px', width: '60%', borderRadius: '4px' }} />
        </div>
      </div>
    </div>
  );
}

const LiveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-7.8 1.6 1.3-8 9.5z"/></svg>
);
const DotsVerticalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
);

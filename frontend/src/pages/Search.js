/* src/pages/Search.js — Search results */
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchVideos } from '../utils/api';
import { formatViews, timeAgo, placeholderColor } from '../utils/format';
import { VideoCardSkeleton } from '../components/VideoCard';
import './Search.css';

export default function Search() {
  const [params]           = useSearchParams();
  const query               = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setError('');
    searchVideos(query)
      .then(setResults)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <main className="search-page">
      <h1 className="search-page__heading">
        {query ? <>Results for <em>"{query}"</em></> : 'Search YewToob'}
      </h1>

      {error && <p className="search-page__error">⚠️ {error}</p>}

      {loading ? (
        <div className="search-page__skeleton-list">
          {Array.from({ length: 5 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      ) : results.length === 0 && query ? (
        <div className="search-page__empty">
          <p>No videos found for <strong>"{query}"</strong></p>
          <small>Try different keywords or check your spelling.</small>
        </div>
      ) : (
        <div className="search-page__list">
          {results.map((v) => (
            <SearchResultCard key={v._id} video={v} />
          ))}
        </div>
      )}
    </main>
  );
}

/* Horizontal card for search results */
function SearchResultCard({ video }) {
  const [imgError, setImgError] = useState(false);
  const color = placeholderColor(video._id);

  return (
    <Link to={`/watch/${video._id}`} className="search-card">
      {/* Thumb */}
      <div className="search-card__thumb">
        {video.thumbnailUrl && !imgError ? (
          <img src={video.thumbnailUrl} alt={video.title} onError={() => setImgError(true)} />
        ) : (
          <div className="search-card__thumb-placeholder" style={{ background: color }}>
            <svg width="36" height="36" viewBox="0 0 48 48" fill="none" opacity="0.5">
              <polygon points="18,13 38,24 18,35" fill="white"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="search-card__info">
        <h2 className="search-card__title">{video.title}</h2>
        <p className="search-card__meta">
          {formatViews(video.views)} · {timeAgo(video.createdAt)}
        </p>
        <p className="search-card__channel">
          {video.uploaderName || video.uploader?.username || 'Unknown'}
        </p>
        {video.description && (
          <p className="search-card__desc">{video.description.slice(0, 120)}{video.description.length > 120 ? '…' : ''}</p>
        )}
      </div>
    </Link>
  );
}

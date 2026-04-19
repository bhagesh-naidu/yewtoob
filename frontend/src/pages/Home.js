/* src/pages/Home.js — Video feed grid */
import React, { useEffect, useState } from 'react';
import VideoCard, { VideoCardSkeleton } from '../components/VideoCard';
import { getVideos } from '../utils/api';
import './Home.css';

export default function Home() {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    setLoading(true);
    getVideos()
      .then(setVideos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Category chips — static for now */}
      <div className="home__chips" role="tablist" aria-label="Filter by category">
        {CHIPS.map((c) => (
          <button key={c} className={`home__chip${c === 'All' ? ' home__chip--active' : ''}`} role="tab">
            {c}
          </button>
        ))}
      </div>

      {error && (
        <div className="home__error">
          <p>⚠️ Could not load videos: {error}</p>
          <small>Make sure the backend is running on port 5000.</small>
        </div>
      )}

      {/* Video grid */}
      <div className="home__grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : videos.map((v) => <VideoCard key={v._id} video={v} />)
        }
      </div>

      {!loading && videos.length === 0 && !error && (
        <div className="home__empty">
          <EmptyIcon />
          <h2>No videos yet</h2>
          <p>Be the first to upload something!</p>
        </div>
      )}
    </main>
  );
}

const CHIPS = ['All', 'Music', 'Gaming', 'News', 'Sports', 'Tech', 'Film', 'Education', 'Autos'];

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" opacity="0.3">
    <rect x="8" y="12" width="48" height="40" rx="6" stroke="currentColor" strokeWidth="3"/>
    <polygon points="26,24 42,32 26,40" fill="currentColor"/>
  </svg>
);

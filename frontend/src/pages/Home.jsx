/* src/pages/Home.jsx */
import React, { useEffect, useState } from 'react';
import VideoCard, { VideoCardSkeleton } from '../components/VideoCard';
import { getVideos } from '../utils/api';
import './Home.css';

export default function Home() {
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [activeChip, setActiveChip] = useState('All');

  useEffect(() => {
    setLoading(true);
    getVideos()
      .then(setVideos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Category chips */}
      <div className="home__chips-wrapper">
        <div className="home__chips" role="tablist" aria-label="Filter by category">
          {CHIPS.map((c) => (
            <button 
              key={c} 
              className={`home__chip${c === activeChip ? ' home__chip--active' : ''}`} 
              onClick={() => setActiveChip(c)}
              role="tab"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="home__error">
          <p>⚠️ Could not load videos: {error}</p>
        </div>
      )}

      {/* Video grid */}
      <div className="home__grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)
          : videos.filter(v => activeChip === 'All' || v.category === activeChip || v.tags?.includes(activeChip)).map((v) => <VideoCard key={v._id} video={v} />)
        }
      </div>

      {!loading && videos.length === 0 && !error && (
        <div className="home__empty">
          <h2>No videos found</h2>
        </div>
      )}
    </main>
  );
}

// Chips based precisely on the provided YouTube clone image
const CHIPS = [
  'All', 'Operating systems', 'Music', 'Desktop computers', 'AI', 'Gaming', 
  'Video editing software', 'Cloud computing', 'Microsoft PowerPoint', 
  'Algorithms', 'Security hackers', 'Tablet computers', 'Monetization', 'Passive income'
];

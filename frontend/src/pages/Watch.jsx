/* src/pages/Watch.jsx */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideo, likeVideo, getComments, postComment, deleteComment } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatViews, timeAgo } from '../utils/format';
import './Watch.css';

export default function Watch() {
  const { id }              = useParams();
  const { user, token }     = useAuth();

  const [video,    setVideo]    = useState(null);
  const [comments, setComments] = useState([]);
  const [comment,  setComment]  = useState('');
  const [liked,    setLiked]    = useState(false);
  const [likeCount,setLikeCount]= useState(0);
  
  // Subscription state
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [loading,  setLoading]  = useState(true);
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState('');

  useEffect(() => {
    setLoading(true);
    setLiked(false);

    Promise.all([getVideo(id), getComments(id)])
      .then(([vid, cmts]) => {
        setVideo(vid);
        setLikeCount(vid.likes || 0);
        setComments(cmts);
        setSubscriberCount(vid.uploader?.subscriberCount || 0);
        
        // If logged in, fetch subscription status
        if (token && vid.uploader?._id) {
          fetch(`http://localhost:5000/api/subscriptions/channels/${vid.uploader._id}/status`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(res => res.json())
          .then(data => setSubscribed(data.isSubscribed));
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleLike = async () => {
    if (!token) return alert('Sign in to like videos');
    if (liked) return;
    try {
      const res = await likeVideo(id, token);
      setLikeCount(res.likes);
      setLiked(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubscribe = async () => {
    if (!token) return alert('Sign in to subscribe');
    if (!video?.uploader?._id) return;
    
    try {
      if (subscribed) {
        await fetch(`http://localhost:5000/api/subscriptions/unsubscribe/${video.uploader._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubscribed(false);
        setSubscriberCount(prev => prev - 1);
      } else {
        await fetch(`http://localhost:5000/api/subscriptions/subscribe`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ channelId: video.uploader._id })
        });
        setSubscribed(true);
        setSubscriberCount(prev => prev + 1);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!token) return alert('Sign in to comment');
    if (!comment.trim()) return;

    setPosting(true);
    try {
      const newComment = await postComment({ videoId: id, text: comment.trim() }, token);
      setComments((prev) => [newComment, ...prev]);
      setComment('');
    } catch (e) {
      alert(e.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (e) {
      alert(e.message);
    }
  };

  const isExternal = (url) => url?.startsWith('http');

  const getStreamUrl = (url) => {
    if (isExternal(url)) return url;
    const filename = url.split('/').pop();
    // Use the backend chunked stream route!
    return `http://localhost:5000/api/videos/stream/${filename}`;
  };

  if (loading) return <WatchSkeleton />;
  if (error)   return <div className="watch__error">⚠️ {error}</div>;
  if (!video)  return null;

  return (
    <div className="watch">
      <div className="watch__main">
        {/* ── Video player ───────────────────────────────────── */}
        <div className="watch__player-wrap">
          <video
            className="watch__player"
            src={getStreamUrl(video.videoUrl)}
            controls
            autoPlay
            controlsList={isExternal(video.videoUrl) ? "nodownload" : ""}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* ── Title & meta ───────────────────────────────────── */}
        <div className="watch__info">
          <h1 className="watch__title">{video.title}</h1>

          <div className="watch__row">
            <div className="watch__channel-info">
              <div className="watch__channel-avatar">
                {(video.uploaderName || 'U').charAt(0).toUpperCase()}
              </div>
              <div style={{ marginRight: '24px' }}>
                <strong className="watch__channel-name">
                  {video.uploaderName || video.uploader?.username || 'Unknown'}
                </strong>
                <span className="watch__views">{formatViews(subscriberCount)} subscribers</span>
              </div>
              
              {user?._id !== video?.uploader?._id && (
                <button 
                  className={`watch__subscribe-btn ${subscribed ? 'watch__subscribe-btn--active' : ''}`}
                  onClick={handleSubscribe}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="watch__actions">
              <button
                className={`watch__action-btn watch__action-btn--like${liked ? ' active' : ''}`}
                onClick={handleLike}
              >
                <LikeIcon filled={liked} />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="watch__desc">
            <strong>{formatViews(video.views)} views • {timeAgo(video.createdAt)}</strong>
            <p style={{ marginTop: '8px' }}>{video.description}</p>
            {video.tags?.length > 0 && (
              <div className="watch__tags" style={{ marginTop: '12px' }}>
                {video.tags.map((tag) => (
                  <span key={tag} style={{ color: 'var(--blue)', fontSize: '0.85rem', marginRight: '8px' }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Comments ───────────────────────────────────────── */}
        <div className="watch__comments">
          <h2 className="watch__comments-title">
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>

          <form className="watch__comment-form" onSubmit={handleComment}>
            <div className="watch__comment-avatar">
              {user ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="watch__comment-input-wrap">
              <input
                className="watch__comment-input"
                placeholder={user ? 'Add a comment…' : 'Sign in to comment'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={!user}
              />
              {comment.trim() && (
                <div className="watch__comment-actions">
                  <button type="button" onClick={() => setComment('')} className="watch__comment-cancel">
                    Cancel
                  </button>
                  <button type="submit" className="watch__comment-submit" disabled={posting}>
                    {posting ? 'Posting…' : 'Comment'}
                  </button>
                </div>
              )}
            </div>
          </form>

          <div className="watch__comment-list">
            {comments.map((c) => (
              <div key={c._id} className="watch__comment">
                <div className="watch__comment-avatar watch__comment-avatar--sm">
                  {(c.authorName || c.author?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="watch__comment-body">
                  <div className="watch__comment-meta">
                    <strong>@{c.authorName || c.author?.username}</strong>
                    <span>{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="watch__comment-text">{c.text}</p>
                </div>
                {user && (user._id === (c.author?._id || c.author)) && (
                  <button
                    className="watch__comment-delete"
                    onClick={() => handleDeleteComment(c._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WatchSkeleton() {
  return (
    <div className="watch">
      <div className="watch__main">
        <div className="skeleton-box" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius)', marginBottom: '16px' }} />
        <div className="skeleton-box" style={{ height: '28px', width: '70%', borderRadius: '4px', marginBottom: '10px' }} />
        <div className="skeleton-box" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
      </div>
    </div>
  );
}

const LikeIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

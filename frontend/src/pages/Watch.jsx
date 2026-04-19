/* src/pages/Watch.js — Video player page */
import React, { useEffect, useState, useCallback } from 'react';
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
  const [loading,  setLoading]  = useState(true);
  const [posting,  setPosting]  = useState(false);
  const [error,    setError]    = useState('');

  // Load video + comments
  useEffect(() => {
    setLoading(true);
    setLiked(false);

    Promise.all([getVideo(id), getComments(id)])
      .then(([vid, cmts]) => {
        setVideo(vid);
        setLikeCount(vid.likes || 0);
        setComments(cmts);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Like handler
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

  // Comment submit
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

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId, token);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (e) {
      alert(e.message);
    }
  };

  // Determine if this is an external URL or local file
  const isExternal = (url) => url?.startsWith('http');

  if (loading) return <WatchSkeleton />;
  if (error)   return <div className="watch__error">⚠️ {error}</div>;
  if (!video)  return null;

  return (
    <div className="watch">
      <div className="watch__main">
        {/* ── Video player ───────────────────────────────────── */}
        <div className="watch__player-wrap">
          {isExternal(video.videoUrl) ? (
            <video
              className="watch__player"
              src={video.videoUrl}
              controls
              autoPlay
              controlsList="nodownload"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <video
              className="watch__player"
              src={`http://localhost:5000${video.videoUrl}`}
              controls
              autoPlay
            />
          )}
        </div>

        {/* ── Title & meta ───────────────────────────────────── */}
        <div className="watch__info">
          <h1 className="watch__title">{video.title}</h1>

          <div className="watch__row">
            <div className="watch__channel-info">
              <div className="watch__channel-avatar">
                {(video.uploaderName || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <strong className="watch__channel-name">
                  {video.uploaderName || video.uploader?.username || 'Unknown'}
                </strong>
                <span className="watch__views">{formatViews(video.views)} · {timeAgo(video.createdAt)}</span>
              </div>
            </div>

            {/* Like button */}
            <button
              className={`watch__like-btn${liked ? ' watch__like-btn--liked' : ''}`}
              onClick={handleLike}
              aria-label="Like video"
            >
              <LikeIcon filled={liked} />
              <span>{likeCount}</span>
            </button>
          </div>

          {/* Description */}
          {video.description && (
            <div className="watch__desc">
              <p>{video.description}</p>
            </div>
          )}

          {/* Tags */}
          {video.tags?.length > 0 && (
            <div className="watch__tags">
              {video.tags.map((tag) => (
                <span key={tag} className="watch__tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Comments ───────────────────────────────────────── */}
        <div className="watch__comments">
          <h2 className="watch__comments-title">
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h2>

          {/* Comment form */}
          <form className="watch__comment-form" onSubmit={handleComment}>
            <div className="watch__comment-avatar">
              {user ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="watch__comment-input-wrap">
              <textarea
                className="watch__comment-input"
                placeholder={user ? 'Add a comment…' : 'Sign in to comment'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
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

          {/* Comment list */}
          <div className="watch__comment-list">
            {comments.map((c) => (
              <div key={c._id} className="watch__comment">
                <div className="watch__comment-avatar watch__comment-avatar--sm">
                  {(c.authorName || c.author?.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="watch__comment-body">
                  <div className="watch__comment-meta">
                    <strong>{c.authorName || c.author?.username}</strong>
                    <span>{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="watch__comment-text">{c.text}</p>
                </div>
                {/* Delete — only for comment author */}
                {user && (user._id === (c.author?._id || c.author)) && (
                  <button
                    className="watch__comment-delete"
                    onClick={() => handleDeleteComment(c._id)}
                    aria-label="Delete comment"
                  >
                    <TrashIcon />
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

/* ── Skeleton ────────────────────────────────────────────────── */
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

/* ── Icons ───────────────────────────────────────────────────── */
const LikeIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

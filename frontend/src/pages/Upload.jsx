/* src/pages/Upload.js — Video upload form */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideoMeta } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './Upload.css';

export default function Upload() {
  const { user, token } = useAuth();
  const navigate         = useNavigate();

  const [form, setForm]       = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    tags: '',
    category: 'General',
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="upload-page">
        <div className="upload-page__gate">
          <h2>Sign in to upload</h2>
          <p>You need an account to share videos on YewToob.</p>
          <a href="/login" className="upload-page__gate-btn">Sign in</a>
        </div>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.videoUrl.trim()) {
      return setError('Title and video URL are required.');
    }

    setLoading(true);
    try {
      const video = await uploadVideoMeta(form, token);
      setSuccess('Video uploaded successfully! Redirecting…');
      setTimeout(() => navigate(`/watch/${video._id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="upload-page">
      <div className="upload-card">
        <h1 className="upload-card__title">
          <UploadIcon /> Upload Video
        </h1>
        <p className="upload-card__sub">Share a video by providing a public URL</p>

        {error   && <div className="upload-msg upload-msg--error">{error}</div>}
        {success && <div className="upload-msg upload-msg--success">{success}</div>}

        <form className="upload-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="upload-form__field">
            <label htmlFor="title">Title <span className="req">*</span></label>
            <input
              id="title" name="title" type="text"
              value={form.title} onChange={handleChange}
              placeholder="My awesome video"
              maxLength={150} required
            />
          </div>

          {/* Video URL */}
          <div className="upload-form__field">
            <label htmlFor="videoUrl">Video URL <span className="req">*</span></label>
            <input
              id="videoUrl" name="videoUrl" type="url"
              value={form.videoUrl} onChange={handleChange}
              placeholder="https://example.com/video.mp4"
              required
            />
            <small>Must be a direct link to an .mp4 / .webm file.</small>
          </div>

          {/* Thumbnail */}
          <div className="upload-form__field">
            <label htmlFor="thumbnailUrl">Thumbnail URL</label>
            <input
              id="thumbnailUrl" name="thumbnailUrl" type="url"
              value={form.thumbnailUrl} onChange={handleChange}
              placeholder="https://example.com/thumb.jpg (optional)"
            />
          </div>

          {/* Description */}
          <div className="upload-form__field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description" name="description"
              value={form.description} onChange={handleChange}
              placeholder="What is this video about?"
              rows={4} maxLength={2000}
            />
          </div>

          {/* Tags */}
          <div className="upload-form__field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags" name="tags" type="text"
              value={form.tags} onChange={handleChange}
              placeholder="music, vlog, tutorial (comma-separated)"
            />
          </div>

          {/* Category */}
          <div className="upload-form__field">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <button type="submit" className="upload-form__submit" disabled={loading}>
            {loading ? 'Uploading…' : 'Publish Video'}
          </button>
        </form>
      </div>
    </main>
  );
}

const CATEGORIES = ['General','Music','Gaming','News','Sports','Technology','Film','Education','Autos','Travel'];

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

// src/utils/api.js — Centralised API helper
const BASE = '/api'; // CRA proxy forwards /api -> localhost:5000

/**
 * Generic fetch wrapper.
 * @param {string} endpoint  e.g. '/videos'
 * @param {RequestInit} options
 * @param {string|null} token  JWT token if needed
 */
export async function apiFetch(endpoint, options = {}, token = null) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// ── Videos ──────────────────────────────────────────────────────
export const getVideos  = ()        => apiFetch('/videos');
export const getVideo   = (id)      => apiFetch(`/videos/${id}`);
export const searchVideos = (q)     => apiFetch(`/videos/search?q=${encodeURIComponent(q)}`);
export const likeVideo  = (id, tok) => apiFetch(`/videos/${id}/like`, { method: 'PATCH' }, tok);
export const uploadVideoMeta = (body, tok) =>
  apiFetch('/videos', { method: 'POST', body: JSON.stringify(body) }, tok);
export const deleteVideo = (id, tok) =>
  apiFetch(`/videos/${id}`, { method: 'DELETE' }, tok);

// ── Comments ────────────────────────────────────────────────────
export const getComments = (videoId)      => apiFetch(`/comments?videoId=${videoId}`);
export const postComment = (body, tok)    =>
  apiFetch('/comments', { method: 'POST', body: JSON.stringify(body) }, tok);
export const deleteComment = (id, tok)   =>
  apiFetch(`/comments/${id}`, { method: 'DELETE' }, tok);

// ── Users ────────────────────────────────────────────────────────
export const signup = (body) =>
  apiFetch('/users/signup', { method: 'POST', body: JSON.stringify(body) });
export const login  = (body) =>
  apiFetch('/users/login',  { method: 'POST', body: JSON.stringify(body) });

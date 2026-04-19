/* src/components/Navbar.js — Top navigation bar */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout }   = useAuth();
  const { dark, toggle }   = useTheme();
  const navigate            = useNavigate();
  const [query, setQuery]   = useState('');
  const [menuOpen, setMenu] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setMenu(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* ── Logo ───────────────────────────────── */}
      <Link to="/" className="navbar__logo" aria-label="YewToob home">
        {/* Inline SVG play button icon */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#ff2b2b"/>
          <polygon points="12,9 25,16 12,23" fill="white"/>
        </svg>
        <span className="navbar__logo-text">YewToob</span>
      </Link>

      {/* ── Search bar ─────────────────────────── */}
      <form className="navbar__search" onSubmit={handleSearch} role="search">
        <input
          type="search"
          className="navbar__search-input"
          placeholder="Search videos…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search"
        />
        <button type="submit" className="navbar__search-btn" aria-label="Submit search">
          <SearchIcon />
        </button>
      </form>

      {/* ── Right controls ─────────────────────── */}
      <div className="navbar__right">
        {/* Dark mode toggle */}
        <button
          className="navbar__icon-btn"
          onClick={toggle}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>

        {user ? (
          <>
            {/* Upload button */}
            <Link to="/upload" className="navbar__upload-btn" aria-label="Upload video">
              <UploadIcon />
              <span>Upload</span>
            </Link>

            {/* User avatar / dropdown */}
            <div className="navbar__avatar-wrap" style={{ position: 'relative' }}>
              <button
                className="navbar__avatar"
                onClick={() => setMenu((m) => !m)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {menuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-user">
                    <strong>{user.username}</strong>
                    <small>{user.email}</small>
                  </div>
                  <hr />
                  <button onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="navbar__auth-btns">
            <Link to="/login"  className="navbar__btn navbar__btn--ghost">Sign in</Link>
            <Link to="/signup" className="navbar__btn navbar__btn--red">Join</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ── Inline SVG icons (no external deps) ─────────────────────── */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

/* src/components/Navbar.jsx */
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
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
      {/* ── Left ───────────────────────────────── */}
      <div className="navbar__left">
        <button className="navbar__hamburger" aria-label="Guide">
          <HamburgerIcon />
        </button>
        <Link to="/" className="navbar__logo" aria-label="YouTube Home">
          <svg width="30" height="20" viewBox="0 0 120 80" fill="none" aria-hidden="true">
            <path d="M117.8 13.2c-1.4-5.2-5.5-9.3-10.7-10.7C97.1 0 60 0 60 0S22.9 0 13.4 2.5C8.2 3.9 4.1 8 2.7 13.2 0 22.8 0 40 0 40s0 17.2 2.7 26.8c1.4 5.2 5.5 9.3 10.7 10.7C22.9 80 60 80 60 80s37.1 0 46.6-2.5c5.2-1.4 9.3-5.5 10.7-10.7C120 57.2 120 40 120 40s0-17.2-2.2-26.8z" fill="#FF0000"/>
            <path d="M48 57.2l31.6-17.2L48 22.8v34.4z" fill="#FFF"/>
          </svg>
          <span className="navbar__logo-text">YouTube</span>
          <span className="navbar__country-code">IN</span>
        </Link>
      </div>

      {/* ── Center ─────────────────────────────── */}
      <div className="navbar__center">
        <form className="navbar__search-wrapper" onSubmit={handleSearch}>
          <div className="navbar__search">
            <input
              className="navbar__search-input"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="navbar__search-btn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>
        <button className="navbar__mic-btn" aria-label="Search with your voice">
          <MicIcon />
        </button>
      </div>

      {/* ── Right ──────────────────────────────── */}
      <div className="navbar__right">
        {user ? (
          <>
            <Link to="/upload" className="navbar__create-btn">
              <CreateIcon />
              <span>Create</span>
            </Link>
            <button className="navbar__icon-btn" aria-label="Notifications">
              <BellIcon />
            </button>
            <div style={{ position: 'relative' }}>
              <button className="navbar__avatar" onClick={() => setMenu(!menuOpen)}>
                {user.avatar ? <img src={user.avatar} alt="Avatar" /> : user.username.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-user">
                    <div className="navbar__avatar" style={{width: '40px', height: '40px', margin: 0}}>
                      {user.avatar ? <img src={user.avatar} alt="Avatar" /> : user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="navbar__dropdown-user-info">
                      <strong>{user.username}</strong>
                      <small>{user.email}</small>
                      <Link to="/channel" onClick={() => setMenu(false)}>View your channel</Link>
                    </div>
                  </div>
                  <hr />
                  <button onClick={handleLogout}>
                    <SignOutIcon /> Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="navbar__icon-btn"><DotsIcon /></button>
            <Link to="/login" className="navbar__auth-btn">
              <UserOutlineIcon /> Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ── Icons ───────────────────────────────────────────────────
const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z"/></svg>
);
const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.7zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
);
const MicIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
);
const CreateIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2zm3-7H3v12h14v-6.39l4 1.83V8.56l-4 1.83V6m1-1v3.83L22 7v8l-4-1.83V19H2V5h16z"/></svg>
);
const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20h4c0 1.1-.9 2-2 2s-2-.9-2-2zm10-2.65V19H4v-1.65l2-1.88v-5.15C6 7.4 7.56 5.1 10 4.34v-.38c0-1.42 1.49-2.5 2.99-1.76.65.32 1.01 1.03 1.01 1.76v.39c2.44.75 4 3.06 4 5.98v5.15l2 1.87zm-1 .42l-1.5-1.41v-5.41c0-2.38-1.31-4.32-3.46-4.99-.96-.3-1.95-.3-2.92 0-2.15.67-3.46 2.61-3.46 4.99v5.41L5.5 17.77V18h14v-.23z"/></svg>
);
const UserOutlineIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 0 1-5.55-2.25c.08-1.54 2.82-2.35 5.55-2.35 2.73 0 5.48.81 5.56 2.36A8 8 0 0 1 12 20Zm6.36-3.32C17.06 14.92 14.18 14 12 14c-2.19 0-5.07.92-6.36 2.68A8 8 0 1 1 18.36 16.68ZM12 6a3 3 0 1 0 3 3A3 3 0 0 0 12 6Zm0 5a2 2 0 1 1 2-2A2 2 0 0 1 12 11Z"/></svg>
);
const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"/></svg>
);
const SignOutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1l1.4 1.4 4.5-4.5-4.5-4.5-1.4 1.4 2.1 2.1H3v2h10.2l-2.1 2.1z"/></svg>
);

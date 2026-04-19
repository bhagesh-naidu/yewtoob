/* src/components/Sidebar.jsx */
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar__section">
        <NavItem to="/" icon={<HomeIcon />} label="Home" activeIcon={<HomeActiveIcon />} />
        <NavItem to="/shorts" icon={<ShortsIcon />} label="Shorts" />
        <NavItem to="/subscriptions" icon={<SubIcon />} label="Subscriptions" activeIcon={<SubActiveIcon />} />
      </div>

      <div className="sidebar__section">
        <div className="sidebar__title">
          You <ChevronRightIcon />
        </div>
        <NavItem to="/history" icon={<HistoryIcon />} label="History" />
        <NavItem to="/playlists" icon={<PlaylistIcon />} label="Playlists" />
        <NavItem to="/watch-later" icon={<WatchLaterIcon />} label="Watch later" />
        <NavItem to="/liked" icon={<LikeIcon />} label="Liked videos" />
        <NavItem to="/downloads" icon={<DownloadIcon />} label="Downloads" />
      </div>

      {!user && (
        <div className="sidebar__section sidebar__auth-promo">
          <p>Sign in to like videos, comment, and subscribe.</p>
          <Link to="/login" className="sidebar__auth-btn">
             <UserOutlineIcon /> Sign in
          </Link>
        </div>
      )}

      {user && (
        <div className="sidebar__section">
          <div className="sidebar__title">Subscriptions</div>
          {/* Subscriptions will be populated dynamically from backend */}
          <NavItem to="/channel/dummy1" icon={<img src="https://i.pravatar.cc/100?img=1" className="sidebar__avatar" />} label="Computer Science" />
          <NavItem to="/channel/dummy2" icon={<img src="https://i.pravatar.cc/100?img=2" className="sidebar__avatar" />} label="Telugu Gita" />
        </div>
      )}

      <div className="sidebar__section">
        <div className="sidebar__title">Explore</div>
        <NavItem to="/explore/trending" icon={<TrendIcon />} label="Trending" />
        <NavItem to="/explore/shopping" icon={<ShoppingIcon />} label="Shopping" />
        <NavItem to="/explore/music" icon={<MusicIcon />} label="Music" />
        <NavItem to="/explore/movies" icon={<MoviesIcon />} label="Movies" />
        <NavItem to="/explore/gaming" icon={<GameIcon />} label="Gaming" />
        <NavItem to="/explore/news" icon={<NewsIcon />} label="News" />
        <NavItem to="/explore/sports" icon={<SportIcon />} label="Sports" />
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label, activeIcon }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        'sidebar__link' + (isActive ? ' sidebar__link--active' : '')
      }
    >
      {({ isActive }) => (
        <>
          <span className="sidebar__icon">{isActive && activeIcon ? activeIcon : icon}</span>
          <span className="sidebar__label">{label}</span>
        </>
      )}
    </NavLink>
  );
}

/* ── Outline Icons (YouTube style) ───────────────────────────────── */
const HomeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.44l7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32l-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z"/></svg>;
const HomeActiveIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.44l7 6.09V20h-4v-6H9v6H5v-9.47z"/></svg>;
const ShortsIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.77 10.32l-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.06 1.42.94 2.66 2.23 3.14l1.2.5L6 14.94c-1.84.96-2.53 3.23-1.56 5.06s3.24 2.53 5.07 1.56L18 17.06c1.29-.68 2.07-2.04 2-3.49-.06-1.42-.94-2.66-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z"/></svg>;
const SubIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z"/></svg>;
const SubActiveIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 7H4V6h16v1zm2 2v12H2V9h20zm-7 6l-5-3v6l5-3zm2-12H7v1h10V3z"/></svg>;

const HistoryIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM22 12c0 5.51-4.49 10-10 10S2 17.51 2 12h1c0 4.96 4.04 9 9 9s9-4.04 9-9-4.04-9-9-9C8.81 3 5.92 4.64 4.28 7.38c-.11.18-.22.37-.31.56L3.94 8H8v1H1.96V3h1v4.74c.04-.09.07-.17.11-.25.11-.22.23-.42.35-.63C5.13 3.47 8.35 1.5 12 1.5c5.51 0 10 4.49 10 10.5z"/></svg>;
const PlaylistIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2 3v-8l7 4-7 4z"/></svg>;
const WatchLaterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.97 16.95L10 13.87V7h2v5.76l4.03 2.49-1.06 1.7zM12 3c-4.96 0-9 4.04-9 9s4.04 9 9 9 9-4.04 9-9-4.04-9-9-9m0-1c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/></svg>;
const LikeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h4h1h9.43c1.06 0 1.98-.67 2.19-1.61l1.34-6C21.23 12.15 20.18 11 18.77 11zM7 20H4v-8h3v8zm12.96-5.87l-1.34 6C18.41 20.65 17.89 21 17.43 21H8v-8.61l5.6-6.06C13.84 6.06 14.11 6 14.38 6c.08 0 .15.03.2.08.04.05.09.15.02.39L13.13 11h5.64c.48 0 .8.2.93.39.11.16.14.38.06.74z"/></svg>;
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 18v1H6v-1h11zm-.5-6.6l-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"/></svg>;
const ChevronRightIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 18.4l-1.4-1.4 5.6-5.6-5.6-5.6 1.4-1.4 7 7-7 7z"/></svg>;
const UserOutlineIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 0 1-5.55-2.25c.08-1.54 2.82-2.35 5.55-2.35 2.73 0 5.48.81 5.56 2.36A8 8 0 0 1 12 20Zm6.36-3.32C17.06 14.92 14.18 14 12 14c-2.19 0-5.07.92-6.36 2.68A8 8 0 1 1 18.36 16.68ZM12 6a3 3 0 1 0 3 3A3 3 0 0 0 12 6Zm0 5a2 2 0 1 1 2-2A2 2 0 0 1 12 11Z"/></svg>;

// Explore Icons
const TrendIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.71 18.44L14 16v-2.36l4 2.8V17L11.5 12 8 13.9 3.51 9 4.3 8.32l3.6 3.1 3.6-1.9 6.5 4.5V11h1v7.44l-2.29 0z"/></svg>;
const ShoppingIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6v15h12V6zM12 3c1.65 0 3 1.35 3 3H9c0-1.65 1.35-3 3-3zm5 17H7V7h10v13z"/></svg>;
const MusicIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>;
const MoviesIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 4v1h-2V4c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H6V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1s1-.45 1-1v-1h2v1c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-1h2v1c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1s-1 .45-1 1zM8 18H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V8h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V8h2v2z"/></svg>;
const GameIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 12l-2.02-6.06c-.19-.58-.73-.94-1.34-.94h-12.44c-.61 0-1.15.36-1.34.94L2.42 12c-.11.33-.08.68.08.99.16.31.44.55.77.67l3.63 1.3V18c0 .55.45 1 1 1s1-.45 1-1v-1.55l3.22-.64 3.22.64V18c0 .55.45 1 1 1s1-.45 1-1v-3.04l3.63-1.3c.33-.12.61-.36.77-.67.16-.31.19-.66.08-.99zM7.5 10c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm9 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>;
const NewsIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 13H5v-2h9v2zm5-4H5V7h14v6z"/></svg>;
const SportIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 5H3v14h18V5zm-2 12H5V7h14v10zm-6-2.5h-2v-5h2v5z"/></svg>;

/* src/pages/Placeholder.js — Stub pages for Trending & Subscriptions */
import React from 'react';
import './Placeholder.css';

export function Trending() {
  return (
    <PlaceholderPage
      icon={<TrendIcon />}
      title="Trending"
      subtitle="The hottest videos on YewToob right now."
      note="Trending feed coming soon."
    />
  );
}

export function Subscriptions() {
  return (
    <PlaceholderPage
      icon={<SubIcon />}
      title="Subscriptions"
      subtitle="Videos from channels you follow."
      note="Subscribe to channels to see their latest uploads here."
    />
  );
}

function PlaceholderPage({ icon, title, subtitle, note }) {
  return (
    <main className="placeholder-page">
      <div className="placeholder-page__icon">{icon}</div>
      <h1>{title}</h1>
      <p className="placeholder-page__sub">{subtitle}</p>
      <p className="placeholder-page__note">{note}</p>
    </main>
  );
}

const TrendIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const SubIcon = () => (
  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

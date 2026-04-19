// src/App.js — Root component: providers + router + layout
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar  from './components/Navbar';
import Sidebar from './components/Sidebar';

import Home          from './pages/Home';
import Watch         from './pages/Watch';
import Search        from './pages/Search';
import Login         from './pages/Login';
import Signup        from './pages/Signup';
import Upload        from './pages/Upload';
import { Trending, Subscriptions } from './pages/Placeholder';

import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

/**
 * AppShell separates the fixed chrome (Navbar + Sidebar) from
 * the scrollable page content. Auth pages get a clean full-screen
 * layout without sidebar.
 */
function AppShell() {
  return (
    <>
      <Navbar />

      <div className="app-body">
        <Routes>
          {/* ── Auth pages — no sidebar ─────────────────── */}
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ── Main app — with sidebar ─────────────────── */}
          <Route
            path="/*"
            element={
              <>
                <Sidebar />
                <main className="app-content">
                  <Routes>
                    <Route path="/"                element={<Home />} />
                    <Route path="/watch/:id"       element={<Watch />} />
                    <Route path="/search"          element={<Search />} />
                    <Route path="/upload"          element={<Upload />} />
                    <Route path="/trending"        element={<Trending />} />
                    <Route path="/subscriptions"   element={<Subscriptions />} />
                    {/* 404 fallback */}
                    <Route path="*"               element={<NotFound />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1>Page not found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" className="not-found__home">Go home</a>
    </div>
  );
}

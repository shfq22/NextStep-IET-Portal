import React from 'react';
import { Link } from 'react-router-dom';
import IetLogo from '../components/common/IetLogo';
import '../styles/collegeConnectLanding.css';

export default function CollegeConnectHome({ theme, toggleTheme }) {
  return (
    <div className="cc-landing">
      <nav className="cc-nav" aria-label="Primary">
        <Link className="cc-nav-brand" to="/">
          <div className="cc-nav-logo-ring">
            <IetLogo className="w-10 h-10" />
          </div>
          <div className="cc-nav-title-group">
            <span className="cc-nav-title">College Connect</span>
            <span className="cc-nav-sub">IET Lucknow</span>
          </div>
        </Link>
        <div className="cc-dm-wrap">
          <span className="cc-dm-label">Dark</span>
          <button
            type="button"
            className="cc-dm-toggle"
            aria-label="Toggle dark mode"
            aria-pressed={theme === 'dark'}
            onClick={toggleTheme}
          >
            <span className="cc-dm-icon sun" aria-hidden>
              ☀️
            </span>
            <span className="cc-dm-icon moon" aria-hidden>
              🌙
            </span>
          </button>
        </div>
      </nav>

      <section className="cc-hero" aria-labelledby="cc-hero-title">
        <div className="cc-hero-bg" aria-hidden />
        <div className="cc-hero-overlay" aria-hidden />
        <div className="cc-hero-vignette" aria-hidden />

        <div className="cc-hero-content">
          <div className="cc-logo-showcase">
            <div className="cc-logo-inner">
              <IetLogo className="w-20 h-20" />
            </div>
          </div>

          <div className="cc-hero-badge-row">
            <div className="cc-badge-dot" aria-hidden />
            <span className="cc-badge-text">Institute of Engineering &amp; Technology · Lucknow · Est. 1984</span>
            <div className="cc-badge-dot" aria-hidden />
          </div>

          <h1 id="cc-hero-title" className="cc-hero-heading">
            College
            <br />
            <span className="cc-highlight">Connect</span>
          </h1>

          <p className="cc-hero-sub">
            Your campus.&nbsp; <em>Your network.</em>&nbsp; Your career.
          </p>

          <div className="cc-cards-row">
            <Link className="cc-portal-card cc-card-dsw" to="/dsw/login">
              <div className="cc-card-accent-bar" />
              <div className="cc-card-top">
                <div className="cc-card-icon" aria-hidden>
                  🎓
                </div>
                <div className="cc-card-arrow" aria-hidden>
                  ↗
                </div>
              </div>
              <span className="cc-card-tag">Student Welfare</span>
              <h2 className="cc-card-title">DSW Portal</h2>
              <p className="cc-card-desc">
                Scholarships, grievances, document vault, announcements &amp; community forum — your academic life, fully
                organised.
              </p>
              <div className="cc-card-chips">
                <span className="cc-chip">Scholarships</span>
                <span className="cc-chip">Grievances</span>
                <span className="cc-chip">Docs</span>
                <span className="cc-chip">Forum</span>
                <span className="cc-chip">Announcements</span>
              </div>
              <span className="cc-card-cta">Enter Portal →</span>
            </Link>

            <Link className="cc-portal-card cc-card-place" to="/placement">
              <div className="cc-card-accent-bar" />
              <div className="cc-card-top">
                <div className="cc-card-icon" aria-hidden>
                  💼
                </div>
                <div className="cc-card-arrow" aria-hidden>
                  ↗
                </div>
              </div>
              <span className="cc-card-tag">Careers &amp; Placement</span>
              <h2 className="cc-card-title">Placement Hub</h2>
              <p className="cc-card-desc">
                Senior profiles, prep guides, AI-powered guidance &amp; structured referrals — launch your career with
                confidence.
              </p>
              <div className="cc-card-chips">
                <span className="cc-chip">Senior Profiles</span>
                <span className="cc-chip">Prep Tips</span>
                <span className="cc-chip">Referrals</span>
                <span className="cc-chip">AI Guide</span>
              </div>
              <span className="cc-card-cta">Open Hub →</span>
            </Link>
          </div>

          <div className="cc-stats-bar">
            <div className="cc-stat">
              <span className="cc-stat-num">4000+</span>
              <span className="cc-stat-label">Students</span>
            </div>
            <div className="cc-stat-div" aria-hidden />
            <div className="cc-stat">
              <span className="cc-stat-num">200+</span>
              <span className="cc-stat-label">Placements</span>
            </div>
            <div className="cc-stat-div" aria-hidden />
            <div className="cc-stat">
              <span className="cc-stat-num">40+</span>
              <span className="cc-stat-label">Years</span>
            </div>
          </div>
        </div>

        <div className="cc-scroll-hint">
          <span>Explore</span>
          <span aria-hidden>▼</span>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import './PageLoader.css';

export function PageLoader() {
  return (
    <div className="page-loader-shell">
      <div className="page-loader-wrapper">
        <span className="page-loader-letter">L</span>
        <span className="page-loader-letter">o</span>
        <span className="page-loader-letter">a</span>
        <span className="page-loader-letter">d</span>
        <span className="page-loader-letter">i</span>
        <span className="page-loader-letter">n</span>
        <span className="page-loader-letter">g</span>
        <span className="page-loader-letter">.</span>
        <span className="page-loader-letter">.</span>
        <span className="page-loader-letter">.</span>
        <div className="page-loader-bar" />
      </div>
    </div>
  );
}

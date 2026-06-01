import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <p>PackLM v1.0 — MIT License &nbsp;·&nbsp;
        <Link to="/">How it works</Link> &nbsp;·&nbsp;
        <Link to="/converter">Converter</Link> &nbsp;·&nbsp;
        <Link to="/docs">Docs</Link>
      </p>
    </footer>
  );
}

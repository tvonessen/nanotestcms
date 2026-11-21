'use client';

import React from 'react';

// Rendered above the list table via admin.components.beforeListTable.
// Plain links: the endpoints answer with Content-Disposition: attachment,
// so the browser downloads the CSV and stays on the list view.
// Auth works via the admin session cookie.
export default function SurveyExportButtons() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0 0 1rem' }}>
      <a className="btn btn--style-primary btn--size-medium" href="/api/survey-export">
        Antworten als CSV
      </a>
      <a
        className="btn btn--style-secondary btn--size-medium"
        href="/api/survey-export?type=contacts"
      >
        Kontakte als CSV
      </a>
    </div>
  );
}

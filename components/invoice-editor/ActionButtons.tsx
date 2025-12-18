import React from 'react'

export const ActionButtons: React.FC = () => {
  return (
    <div className="no-print mt-10 flex justify-center border-t border-border pt-8">
      <button
        type="button"
        className="btn-press inline-flex items-center justify-center gap-3 rounded-lg bg-ink px-8 py-4 text-sm font-medium text-white shadow-lg transition-all hover:bg-ink-soft hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-muted"
        onClick={() => globalThis.print()}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6,9 6,2 18,2 18,9" />
          <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
        Print / Save as PDF
      </button>
    </div>
  )
}

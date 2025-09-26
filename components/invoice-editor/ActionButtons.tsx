import React from 'react'

export const ActionButtons: React.FC = () => {
  return (
    <div className="no-print mt-10 flex justify-center gap-4 border-t-2 border-slate-100 pt-8">
      <button 
        type="button"
        className="print-button inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] px-8 py-4 text-sm font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl focus:outline-hidden focus-visible:ring-4 focus-visible:ring-indigo-200"
        onClick={() => window.print()}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-opacity"
        >
          <polyline points="6,9 6,2 18,2 18,9"></polyline>
          <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
        Print/Save as PDF
      </button>
    </div>
  )
}

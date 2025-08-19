import React from 'react'

export const ActionButtons: React.FC = () => {
  return (
    <div className="no-print" style={{
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      marginTop: '40px',
      paddingTop: '30px',
      borderTop: '2px solid #f1f3f5'
    }}>
      <button 
        className="print-button"
        onClick={() => window.print()}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '16px 32px',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
          minWidth: '180px',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(102, 126, 234, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.3)'
        }}
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
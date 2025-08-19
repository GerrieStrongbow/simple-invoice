import React from 'react'

interface TotalsSectionProps {
  subtotal: string
  tax: string
  discount: string
  total: string
  taxEnabled: boolean
  taxPercentage: string
  discountEnabled: boolean
  discountPercentage: string
  currencySymbol: string
  totalLabel: string
  onTaxToggle: (enabled: boolean) => void
  onTaxPercentageChange: (percentage: string) => void
  onDiscountToggle: (enabled: boolean) => void
  onDiscountPercentageChange: (percentage: string) => void
  onTotalLabelChange: (label: string) => void
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  subtotal,
  tax,
  discount,
  total,
  taxEnabled,
  taxPercentage,
  discountEnabled,
  discountPercentage,
  currencySymbol,
  totalLabel,
  onTaxToggle,
  onTaxPercentageChange,
  onDiscountToggle,
  onDiscountPercentageChange,
  onTotalLabelChange
}) => {
  const totalValueStyle = {
    textAlign: 'right' as const,
    display: 'inline-block',
    minWidth: '100px',
    backgroundColor: '#f8f9fa',
    padding: '2px 4px',
    borderRadius: '3px',
    border: '1px solid #e9ecef'
  }

  const handleTotalLabelFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#ffffff'
    e.target.style.borderColor = '#667eea'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleTotalLabelBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#f8fafc'
    e.target.style.borderColor = '#e2e8f0'
    e.target.style.boxShadow = 'none'
  }

  const handlePercentageFocus = (enabled: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    if (enabled) {
      e.target.style.borderColor = '#667eea'
      e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
    }
  }

  const handlePercentageBlur = (enabled: boolean) => (e: React.FocusEvent<HTMLInputElement>) => {
    if (enabled) {
      e.target.style.borderColor = '#e2e8f0'
      e.target.style.boxShadow = 'none'
    }
  }

  return (
    <div className="total-section" style={{
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '2px solid #e9ecef',
      marginBottom: '20px'
    }}>
      {/* Subtotal */}
      <div className="total-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '10px'
      }}>
        <span>Subtotal:</span>
        <span style={totalValueStyle}>{currencySymbol}{subtotal}</span>
      </div>

      {/* Discount Row - Only show when enabled */}
      {discountEnabled && (
        <div className="total-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Discount ({discountPercentage}%):</span>
          </div>
          <span style={totalValueStyle}>({currencySymbol}{discount})</span>
        </div>
      )}

      {/* Tax Row - Only show when enabled */}
      {taxEnabled && (
        <div className="total-row" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Tax ({taxPercentage}%):</span>
          </div>
          <span style={totalValueStyle}>{currencySymbol}{tax}</span>
        </div>
      )}

      {/* Control Panel for Tax/Discount (only visible when editing) */}
      <div className="no-print" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '10px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        fontSize: '14px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Discount Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={discountEnabled}
            onChange={(e) => onDiscountToggle(e.target.checked)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <span style={{ color: discountEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>
            Add Discount:
          </span>
          <input
            type="text"
            value={discountPercentage}
            onChange={(e) => onDiscountPercentageChange(e.target.value)}
            disabled={!discountEnabled}
            style={{
              width: '60px',
              backgroundColor: discountEnabled ? '#ffffff' : '#f3f4f6',
              border: discountEnabled ? '2px solid #e2e8f0' : '2px solid #e5e7eb',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '14px',
              textAlign: 'center',
              color: discountEnabled ? '#1f2937' : '#9ca3af',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={handlePercentageFocus(discountEnabled)}
            onBlur={handlePercentageBlur(discountEnabled)}
          />
          <span style={{ color: discountEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>
            %
          </span>
        </div>
        
        {/* Tax Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => onTaxToggle(e.target.checked)}
            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
          />
          <span style={{ color: taxEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>
            Add Tax:
          </span>
          <input
            type="text"
            value={taxPercentage}
            onChange={(e) => onTaxPercentageChange(e.target.value)}
            disabled={!taxEnabled}
            style={{
              width: '60px',
              backgroundColor: taxEnabled ? '#ffffff' : '#f3f4f6',
              border: taxEnabled ? '2px solid #e2e8f0' : '2px solid #e5e7eb',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '14px',
              textAlign: 'center',
              color: taxEnabled ? '#1f2937' : '#9ca3af',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={handlePercentageFocus(taxEnabled)}
            onBlur={handlePercentageBlur(taxEnabled)}
          />
          <span style={{ color: taxEnabled ? '#1f2937' : '#9ca3af', fontWeight: '500' }}>
            %
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div className="total-row total-final" style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 'bold',
        fontSize: '18px',
        color: '#2c3e50',
        borderTop: '1px solid #ccc',
        paddingTop: '10px'
      }}>
        <span
          role="textbox"
          aria-label="Total amount label"
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          style={{
            outline: 'none',
            cursor: 'text',
            padding: '6px 10px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            backgroundColor: '#f8fafc',
            border: '2px solid #e2e8f0',
            minWidth: '140px',
            display: 'inline-block'
          }}
          onFocus={handleTotalLabelFocus}
          onBlur={(e) => {
            onTotalLabelChange(e.target.textContent || 'Total Amount Due:')
            handleTotalLabelBlur(e)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
        >
          {totalLabel}
        </span>
        <span style={{
          ...totalValueStyle,
          fontWeight: 'bold'
        }}>
          {currencySymbol}{total}
        </span>
      </div>
    </div>
  )
}
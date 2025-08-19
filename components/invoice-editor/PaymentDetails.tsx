import React from 'react'
import { Field } from '@/lib/invoice-types'
import { useFieldManagement } from '@/hooks/useFieldManagement'

interface PaymentDetailsProps {
  paymentTitle: string
  onPaymentTitleChange: (title: string) => void
  paymentFields: Field[]
  onPaymentFieldsChange: (fields: Field[]) => void
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentTitle,
  onPaymentTitleChange,
  paymentFields,
  onPaymentFieldsChange
}) => {
  const { addField, removeField, updateField } = useFieldManagement()

  const inputStyles = {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    color: '#1f2937'
  }

  const removeButtonStyles = {
    width: '32px',
    height: '32px',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '2px solid #fecaca',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    transition: 'all 0.2s ease',
    fontWeight: '600'
  }

  const addButtonStyles = {
    width: '100%',
    height: '40px',
    backgroundColor: '#f0f9ff',
    color: '#0284c7',
    border: '2px dashed #0284c7',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    lineHeight: 1,
    marginTop: '8px',
    transition: 'all 0.2s ease'
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#667eea'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#e2e8f0'
    e.target.style.boxShadow = 'none'
  }

  const handleTitleFocus = (e: React.FocusEvent<HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#ffffff'
    e.target.style.borderColor = '#667eea'
    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const handleTitleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    e.target.style.backgroundColor = '#f8fafc'
    e.target.style.borderColor = '#e2e8f0'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div className="bank-details" style={{
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      padding: '24px',
      borderRadius: '12px',
      marginTop: '0px'
    }}>
      <h4 style={{ 
        color: '#1f2937', 
        marginBottom: '20px',
        fontSize: '18px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}></span>
        <span
          role="textbox"
          aria-label="Payment section title"
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
            minWidth: '140px'
          }}
          onFocus={handleTitleFocus}
          onBlur={(e) => {
            onPaymentTitleChange(e.target.textContent || 'Payment Details:')
            handleTitleBlur(e)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.currentTarget.blur()
            }
          }}
        >
          {paymentTitle}
        </span>
      </h4>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {paymentFields.map((field) => (
            <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="text"
                value={field.value}
                placeholder={field.placeholder}
                onChange={(e) => updateField(field.id, e.target.value, paymentFields, onPaymentFieldsChange)}
                autoComplete="off"
                style={inputStyles}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              {paymentFields.length > 1 && (
                <button 
                  className="no-print remove-btn"
                  onClick={() => removeField(field.id, paymentFields, onPaymentFieldsChange)}
                  style={removeButtonStyles}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.borderColor = '#dc2626'
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2'
                    e.currentTarget.style.color = '#dc2626'
                    e.currentTarget.style.borderColor = '#fecaca'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  title="Remove field"
                >×</button>
              )}
            </div>
          ))}
          <button 
            className="no-print add-btn"
            onClick={() => addField(paymentFields, onPaymentFieldsChange)}
            style={addButtonStyles}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0284c7'
              e.currentTarget.style.color = 'white'
              e.currentTarget.style.borderColor = '#0284c7'
              e.currentTarget.style.borderStyle = 'solid'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f9ff'
              e.currentTarget.style.color = '#0284c7'
              e.currentTarget.style.borderColor = '#0284c7'
              e.currentTarget.style.borderStyle = 'dashed'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            title="Add field"
          >
            + Add Field
          </button>
        </div>
        <div>{/* Empty column for spacing */}</div>
      </div>
    </div>
  )
}
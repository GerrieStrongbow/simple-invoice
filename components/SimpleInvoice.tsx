'use client'

import React, { useState, useRef } from 'react'

interface SimpleInvoiceProps {}

interface EditableSpanProps {
  children: React.ReactNode
  className?: string
  contentEditable?: boolean
}

const EditableSpan: React.FC<EditableSpanProps> = ({ 
  children, 
  className = "editable", 
  contentEditable = true 
}) => (
  <span
    contentEditable={contentEditable}
    suppressContentEditableWarning={true}
    className={className}
    style={{
      backgroundColor: '#fff3cd',
      padding: '2px 4px',
      borderRadius: '3px',
      border: '1px dashed #ffc107',
      minWidth: '100px',
      display: 'inline-block'
    }}
  >
    {children}
  </span>
)

export default function SimpleInvoice({}: SimpleInvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [showNotes, setShowNotes] = useState(true)
  const [showLogo, setShowLogo] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen" style={{ 
      fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: '11pt',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa'
    }}>
      <div ref={invoiceRef} className="invoice-container" style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Header */}
        <div className="header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '30px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              margin: 0
            }}>INVOICE</h1>
            
            {showLogo && (
              <div style={{
                border: '2px dashed #ccc',
                padding: '10px',
                borderRadius: '4px',
                minWidth: '80px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: '#999',
                cursor: 'pointer'
              }}>
                Click to add logo
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'right', color: '#666' }}>
            <div><strong>Invoice #:</strong> <EditableSpan>INV-2025-08</EditableSpan></div>
            <div><strong>Date:</strong> <EditableSpan>[DATE]</EditableSpan></div>
            <div><strong>Due Date:</strong> <EditableSpan>[DUE DATE]</EditableSpan></div>
          </div>
        </div>

        {/* From/To Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '50% 50%',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>From:</h3>
            <div contentEditable suppressContentEditableWarning style={{
              backgroundColor: '#fff3cd',
              padding: '10px',
              borderRadius: '4px',
              border: '1px dashed #ffc107',
              minHeight: '120px'
            }}>
              <strong>T/A Gerhard Bekker</strong><br />
              14 Marina Rd<br />
              Die Boord<br />
              Stellenbosch<br />
              South Africa<br /><br />
              <strong>Email:</strong> gerhard.bekker@outlook.com<br />
              <strong>Mobile:</strong> (+27) 063 651 9694
            </div>
          </div>

          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px', fontSize: '16px' }}>To:</h3>
            <div contentEditable suppressContentEditableWarning style={{
              backgroundColor: '#fff3cd',
              padding: '10px',
              borderRadius: '4px',
              border: '1px dashed #ffc107',
              minHeight: '120px'
            }}>
              <strong>Empire Digital Media Ltd (trading as 1Digit)</strong><br />
              <strong>Company Registration #:</strong> 08537519<br />
              Unit 11<br />
              Hove Business Centre Fonthill Road<br />
              Hove, East Sussex, BN3 6HA<br />
              United Kingdom<br /><br />
              <strong>Email:</strong> accounts@1digit.co.uk
            </div>
          </div>
        </div>

        {/* Services Table */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '20px'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '12px',
                textAlign: 'left',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                color: '#2c3e50',
                width: '60%'
              }}>
                <EditableSpan>Description</EditableSpan>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'center',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                color: '#2c3e50',
                width: '15%'
              }}>
                <EditableSpan>Days</EditableSpan>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                color: '#2c3e50',
                width: '15%'
              }}>
                <EditableSpan>Rate (ZAR)</EditableSpan>
              </th>
              <th style={{
                padding: '12px',
                textAlign: 'right',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold',
                color: '#2c3e50',
                width: '10%'
              }}>
                <EditableSpan>Amount (ZAR)</EditableSpan>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: '60px' }}>
              <td style={{
                width: '60%',
                verticalAlign: 'top',
                padding: '12px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <strong><EditableSpan>Item Name</EditableSpan></strong><br />
                <EditableSpan>Description of services provided</EditableSpan>
              </td>
              <td style={{
                width: '15%',
                textAlign: 'center',
                verticalAlign: 'top',
                padding: '12px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <EditableSpan>[DAYS]</EditableSpan>
              </td>
              <td style={{
                width: '15%',
                textAlign: 'right',
                verticalAlign: 'top',
                padding: '12px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <EditableSpan>R[RATE]</EditableSpan>
              </td>
              <td style={{
                width: '10%',
                textAlign: 'right',
                verticalAlign: 'top',
                padding: '12px',
                borderBottom: '1px solid #e9ecef'
              }}>
                <EditableSpan>R[AMOUNT]</EditableSpan>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals Section */}
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '2px solid #e9ecef',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span>Subtotal:</span>
            <EditableSpan style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px'
            }}>R[SUBTOTAL]</EditableSpan>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span>Tax (if applicable):</span>
            <EditableSpan style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px'
            }}>R0.00</EditableSpan>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#2c3e50',
            borderTop: '1px solid #ccc',
            paddingTop: '10px'
          }}>
            <span>Total Amount Due:</span>
            <EditableSpan style={{
              textAlign: 'right',
              display: 'inline-block',
              minWidth: '100px'
            }}>R[TOTAL]</EditableSpan>
          </div>
        </div>

        {/* Payment Details */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '5px',
          marginTop: '0px',
          marginBottom: showNotes ? '20px' : '0px'
        }}>
          <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Payment Details:</h4>
          <div contentEditable suppressContentEditableWarning style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '4px',
            border: '1px dashed #ffc107'
          }}>
            <strong>Account Name:</strong> GERHARD MULLER BEKKER<br />
            <strong>Bank:</strong> ABSA<br />
            <strong>Account Number:</strong> 4120 7672 37<br />
            <strong>Branch Code:</strong> 632005<br />
            <strong>SWIFT Code:</strong> ABSAZAJJ
          </div>
        </div>

        {/* Optional Notes Section */}
        {showNotes && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#2c3e50', marginBottom: '10px' }}>Notes:</h4>
            <div contentEditable suppressContentEditableWarning style={{
              backgroundColor: '#fff3cd',
              padding: '10px',
              borderRadius: '4px',
              border: '1px dashed #ffc107',
              minHeight: '60px'
            }}>
              Notes - any relevant information not covered, additional terms and conditions
            </div>
          </div>
        )}

        {/* Controls (not printed) */}
        <div className="no-print" style={{
          borderTop: '1px solid #ddd',
          paddingTop: '20px',
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Print/Save as PDF
          </button>
          
          <button
            onClick={() => setShowNotes(!showNotes)}
            style={{
              backgroundColor: showNotes ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>

          <button
            onClick={() => setShowLogo(!showLogo)}
            style={{
              backgroundColor: showLogo ? '#28a745' : '#6c757d',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showLogo ? 'Hide Logo' : 'Show Logo'}
          </button>

          <button
            onClick={() => {
              const rows = document.querySelectorAll('tbody tr')
              const lastRow = rows[rows.length - 1]
              const newRow = lastRow.cloneNode(true) as HTMLElement
              lastRow.parentNode?.appendChild(newRow)
            }}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              padding: '10px 15px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Add Row
          </button>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            background-color: white !important;
            padding: 0 !important;
          }
          
          .invoice-container {
            box-shadow: none !important;
            padding: 0 !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          .editable {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
          }
          
          div[style*="background-color: #f8f9fa"] {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          th {
            background-color: #f8f9fa !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
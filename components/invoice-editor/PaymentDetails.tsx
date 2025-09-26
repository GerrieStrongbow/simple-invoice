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

  return (
    <div className="bank-details rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h4 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#667eea] to-[#764ba2]" />
        <input
          type="text"
          aria-label="Payment section title"
          value={paymentTitle}
          onChange={(e) => onPaymentTitleChange(e.target.value)}
          className="min-w-[180px] rounded-lg border-2 border-slate-200 bg-slate-100 px-3 py-1.5 text-base font-semibold text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
        />
      </h4>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          {paymentFields.map((field) => (
            <div key={field.id} className="flex items-center gap-3">
              <input
                type="text"
                value={field.value}
                placeholder={field.placeholder}
                onChange={(e) => updateField(field.id, e.target.value, paymentFields, onPaymentFieldsChange)}
                autoComplete="off"
                className="flex-1 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              {paymentFields.length > 1 && (
                <button
                  className="no-print inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-rose-200 bg-rose-50 text-lg font-semibold text-rose-600 transition hover:scale-105 hover:border-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-rose-100"
                  onClick={() => removeField(field.id, paymentFields, onPaymentFieldsChange)}
                  title="Remove field"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            className="no-print mt-2 inline-flex h-10 w-full items-center justify-center gap-1 rounded-lg border-2 border-dashed border-sky-500 bg-sky-50 text-sm font-semibold text-sky-600 transition hover:-translate-y-0.5 hover:border-solid hover:bg-sky-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-sky-100"
            onClick={() => addField(paymentFields, onPaymentFieldsChange)}
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

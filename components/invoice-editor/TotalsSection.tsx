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

const totalValueClasses = 'inline-block min-w-[100px] rounded border border-slate-200 bg-slate-100 px-2 py-1 text-right font-medium text-slate-700'
const totalLabelClasses = 'inline-block min-w-[140px] cursor-text rounded-lg border-2 border-slate-200 bg-slate-100 px-3 py-1.5 text-base font-semibold text-slate-700 transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100'
const percentageInput = (enabled: boolean) => [
  'w-16 rounded-md border-2 px-2 py-1 text-center text-sm font-semibold transition outline-none',
  enabled
    ? 'border-slate-200 bg-white text-slate-800 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'
    : 'border-slate-200 bg-slate-100 text-slate-400'
].join(' ')

const percentageLabel = (enabled: boolean) => enabled ? 'text-slate-800 font-medium' : 'text-slate-400 font-medium'

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
  return (
    <div className="total-section mt-5 mb-5 border-t-2 border-slate-200 pt-5">
      <div className="total-row mb-3 flex items-center justify-between text-sm">
        <span>Subtotal:</span>
        <span className={totalValueClasses}>
          {currencySymbol}
          {subtotal}
        </span>
      </div>

      {discountEnabled && (
        <div className="total-row mb-3 flex items-center justify-between text-sm">
          <span>Discount ({discountPercentage}%):</span>
          <span className={totalValueClasses}>
            ({currencySymbol}
            {discount})
          </span>
        </div>
      )}

      {taxEnabled && (
        <div className="total-row mb-3 flex items-center justify-between text-sm">
          <span>Tax ({taxPercentage}%):</span>
          <span className={totalValueClasses}>
            {currencySymbol}
            {tax}
          </span>
        </div>
      )}

      <div className="no-print mb-4 flex flex-wrap items-center gap-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={discountEnabled}
            onChange={(e) => onDiscountToggle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className={percentageLabel(discountEnabled)}>Add Discount:</span>
          <input
            type="text"
            value={discountPercentage}
            onChange={(e) => onDiscountPercentageChange(e.target.value)}
            disabled={!discountEnabled}
            className={percentageInput(discountEnabled)}
          />
          <span className={percentageLabel(discountEnabled)}>%</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => onTaxToggle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
          <span className={percentageLabel(taxEnabled)}>Add Tax:</span>
          <input
            type="text"
            value={taxPercentage}
            onChange={(e) => onTaxPercentageChange(e.target.value)}
            disabled={!taxEnabled}
            className={percentageInput(taxEnabled)}
          />
          <span className={percentageLabel(taxEnabled)}>%</span>
        </label>
      </div>

      <div className="total-row total-final flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-800">
        <input
          type="text"
          aria-label="Total amount label"
          value={totalLabel}
          onChange={(e) => onTotalLabelChange(e.target.value)}
          className={totalLabelClasses}
        />
        <span className={`${totalValueClasses} font-bold`}>
          {currencySymbol}
          {total}
        </span>
      </div>
    </div>
  )
}

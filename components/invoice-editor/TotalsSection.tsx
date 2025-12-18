import React from 'react'

// Inline style for html2canvas PDF compatibility (prevents italic rendering)
const headingStyle: React.CSSProperties = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontStyle: 'normal',
}

interface TotalsSectionProps {
  subtotal: string
  tax: string
  discount: string
  total: string
  taxEnabled: boolean
  taxPercentage: string
  taxLabel: string
  discountEnabled: boolean
  discountPercentage: string
  discountLabel: string
  currencySymbol: string
  totalLabel: string
  onTaxToggle: (enabled: boolean) => void
  onTaxPercentageChange: (percentage: string) => void
  onTaxLabelChange: (label: string) => void
  onDiscountToggle: (enabled: boolean) => void
  onDiscountPercentageChange: (percentage: string) => void
  onDiscountLabelChange: (label: string) => void
  onTotalLabelChange: (label: string) => void
}

export const TotalsSection: React.FC<TotalsSectionProps> = ({
  subtotal,
  tax,
  discount,
  total,
  taxEnabled,
  taxPercentage,
  taxLabel,
  discountEnabled,
  discountPercentage,
  discountLabel,
  currencySymbol,
  totalLabel,
  onTaxToggle,
  onTaxPercentageChange,
  onTaxLabelChange,
  onDiscountToggle,
  onDiscountPercentageChange,
  onDiscountLabelChange,
  onTotalLabelChange
}) => {
  return (
    <div className="total-section mt-6 mb-6 border-t border-border pt-6">
      {/* Subtotal Row */}
      <div className="total-row mb-3 flex items-center justify-between text-sm">
        <span className="text-ink-muted">Subtotal:</span>
        <span className="tabular-nums font-medium text-ink-soft">
          {currencySymbol}{subtotal}
        </span>
      </div>

      {/* Discount Row */}
      {discountEnabled && (
        <div className="total-row mb-3 flex items-center justify-between text-sm">
          <span className="text-ink-muted">
            <input
              type="text"
              value={discountLabel}
              onChange={(e) => onDiscountLabelChange(e.target.value)}
              className="invoice-input w-auto bg-transparent text-ink-muted"
              style={{ width: `${Math.max(discountLabel.length + 2, 6)}ch` }}
            />
            ({discountPercentage}%):
          </span>
          <span className="tabular-nums font-medium text-success">
            ({currencySymbol}{discount})
          </span>
        </div>
      )}

      {/* Tax Row */}
      {taxEnabled && (
        <div className="total-row mb-3 flex items-center justify-between text-sm">
          <span className="text-ink-muted">
            <input
              type="text"
              value={taxLabel}
              onChange={(e) => onTaxLabelChange(e.target.value)}
              className="invoice-input w-auto bg-transparent text-ink-muted"
              style={{ width: `${Math.max(taxLabel.length + 2, 5)}ch` }}
            />
            ({taxPercentage}%):
          </span>
          <span className="tabular-nums font-medium text-ink-soft">
            {currencySymbol}{tax}
          </span>
        </div>
      )}

      {/* Tax/Discount Controls */}
      <div className="no-print mb-6 flex flex-wrap items-center gap-6 rounded-lg border border-border bg-paper-warm p-4 text-sm">
        {/* Discount Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={discountEnabled}
            onChange={(e) => onDiscountToggle(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong text-accent focus:ring-accent"
          />
          <span className={discountEnabled ? 'text-ink font-medium' : 'text-ink-muted'}>
            Add
          </span>
          <input
            type="text"
            value={discountLabel}
            onChange={(e) => onDiscountLabelChange(e.target.value)}
            disabled={!discountEnabled}
            className={`w-20 rounded-md border px-2 py-1 text-center text-sm transition outline-none ${
              discountEnabled
                ? 'border-border bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent-muted'
                : 'border-border bg-paper-warm text-ink-faint'
            }`}
            placeholder="Discount"
          />
          <input
            type="text"
            value={discountPercentage}
            onChange={(e) => onDiscountPercentageChange(e.target.value)}
            disabled={!discountEnabled}
            className={`w-14 rounded-md border px-2 py-1 text-center text-sm tabular-nums transition outline-none ${
              discountEnabled
                ? 'border-border bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent-muted'
                : 'border-border bg-paper-warm text-ink-faint'
            }`}
          />
          <span className={discountEnabled ? 'text-ink-soft font-medium' : 'text-ink-faint'}>%</span>
        </label>

        {/* Tax Toggle */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={taxEnabled}
            onChange={(e) => onTaxToggle(e.target.checked)}
            className="h-4 w-4 rounded border-border-strong text-accent focus:ring-accent"
          />
          <span className={taxEnabled ? 'text-ink font-medium' : 'text-ink-muted'}>
            Add
          </span>
          <input
            type="text"
            value={taxLabel}
            onChange={(e) => onTaxLabelChange(e.target.value)}
            disabled={!taxEnabled}
            className={`w-16 rounded-md border px-2 py-1 text-center text-sm transition outline-none ${
              taxEnabled
                ? 'border-border bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent-muted'
                : 'border-border bg-paper-warm text-ink-faint'
            }`}
            placeholder="Tax"
          />
          <input
            type="text"
            value={taxPercentage}
            onChange={(e) => onTaxPercentageChange(e.target.value)}
            disabled={!taxEnabled}
            className={`w-14 rounded-md border px-2 py-1 text-center text-sm tabular-nums transition outline-none ${
              taxEnabled
                ? 'border-border bg-white text-ink focus:border-accent focus:ring-2 focus:ring-accent-muted'
                : 'border-border bg-paper-warm text-ink-faint'
            }`}
          />
          <span className={taxEnabled ? 'text-ink-soft font-medium' : 'text-ink-faint'}>%</span>
        </label>
      </div>

      {/* Total Row - Prominent */}
      <div className="total-row total-final flex items-center justify-between border-t border-border-strong pt-4">
        <input
          type="text"
          aria-label="Total amount label"
          value={totalLabel}
          onChange={(e) => onTotalLabelChange(e.target.value)}
          className="invoice-input font-display text-lg text-ink"
          style={headingStyle}
        />
        <span className="tabular-nums text-xl font-semibold text-ink">
          {currencySymbol}{total}
        </span>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

interface Currency {
  code: string
  symbol: string
  name: string
}

const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
]

interface CurrencySelectorProps {
  value: string
  symbol: string
  onChange: (currency: string, symbol: string) => void
  className?: string
}

export default function CurrencySelector({
  value,
  symbol,
  onChange,
  className = '',
}: Readonly<CurrencySelectorProps>) {
  const [isOpen, setIsOpen] = useState(false)
  
  const currentCurrency = currencies.find(c => c.code === value) || currencies.find(c => c.symbol === symbol)
  
  const handleSelect = (currency: Currency) => {
    onChange(currency.code, currency.symbol)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Show button for editing, hide in print */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-sm text-sm hover:bg-gray-50 no-print"
        type="button"
      >
        <span className="font-mono font-bold">{symbol}</span>
        <span className="text-gray-600">{currentCurrency?.code || value}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-sm shadow-lg z-[100]">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => handleSelect(currency)}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-3 text-sm"
              type="button"
            >
              <span className="font-mono font-bold w-8">{currency.symbol}</span>
              <span className="font-medium w-12">{currency.code}</span>
              <span className="text-gray-600 flex-1">{currency.name}</span>
            </button>
          ))}
        </div>
      )}
      
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-90 cursor-default"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          aria-label="Close currency selector"
        />
      )}
    </div>
  )
}
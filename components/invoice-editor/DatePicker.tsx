'use client'

import { useState, useRef, useEffect } from 'react'

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function DatePicker({ value, onChange, placeholder, className }: DatePickerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputType, setInputType] = useState<'text' | 'date'>('text')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Convert DD/MM/YYYY to YYYY-MM-DD for input[type="date"]
  const toInputFormat = (dateStr: string) => {
    if (!dateStr) return ''
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      const [day, month, year] = parts
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return ''
  }
  
  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  const toDisplayFormat = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-GB')
  }

  const handleClick = () => {
    setIsEditing(true)
    setInputType('text')
  }

  const handleFocus = () => {
    // Show date picker when focusing
    setInputType('date')
    if (inputRef.current) {
      inputRef.current.type = 'date'
      inputRef.current.value = toInputFormat(value)
    }
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = toDisplayFormat(e.target.value)
    onChange(newValue)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setInputType('text')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setInputType('text')
    }
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={inputType}
        value={inputType === 'date' ? toInputFormat(value) : value}
        onChange={inputType === 'date' ? handleDateChange : handleTextChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} w-full px-2 py-1 rounded transition-all duration-200 bg-white border border-blue-400 outline-none`}
        placeholder={placeholder}
        autoFocus
      />
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`${className} w-full px-2 py-1 rounded transition-all duration-200 hover:bg-gray-50 cursor-pointer`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {value || <span className="text-gray-400">{placeholder}</span>}
    </div>
  )
}
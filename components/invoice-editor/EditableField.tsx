'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableFieldProps {
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  multiline?: boolean
  format?: 'text' | 'number' | 'currency' | 'date'
  onBlur?: () => void
  onFocus?: () => void
}

export default function EditableField({
  value,
  onChange,
  placeholder = 'Click to edit',
  className = '',
  multiline = false,
  format = 'text',
  onBlur,
  onFocus,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (onChange && localValue !== value) {
      onChange(localValue)
    }
    onBlur?.()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  const baseClassName = `
    w-full px-2 py-1 rounded transition-all duration-200
    ${!isEditing ? 'hover:bg-gray-50 cursor-pointer' : 'bg-white border border-blue-400'}
    ${className}
  `

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${baseClassName} resize-none outline-none`}
          rows={3}
        />
      )
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={format === 'number' || format === 'currency' ? 'text' : format}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        className={`${baseClassName} outline-none`}
      />
    )
  }

  return (
    <div
      onClick={handleClick}
      className={baseClassName}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {localValue || <span className="text-gray-400">{placeholder}</span>}
    </div>
  )
}
import { useCallback } from 'react'
import { Field } from '@/lib/invoice-types'
import { generateId } from '@/lib/invoice-utils'

export const useFieldManagement = () => {
  // Add a new field to a field array
  const addField = useCallback((fields: Field[], setFields: (fields: Field[]) => void) => {
    const newField: Field = {
      id: generateId(),
      label: 'New Field',
      value: '',
      placeholder: 'Enter value'
    }
    setFields([...fields, newField])
  }, [])

  // Remove a field from a field array (prevent removing if only one field left)
  const removeField = useCallback((
    fieldId: string, 
    fields: Field[], 
    setFields: (fields: Field[]) => void
  ) => {
    if (fields.length > 1) {
      setFields(fields.filter(field => field.id !== fieldId))
    }
  }, [])

  // Update a field's value
  const updateField = useCallback((
    fieldId: string, 
    value: string, 
    fields: Field[], 
    setFields: (fields: Field[]) => void
  ) => {
    setFields(fields.map(field => 
      field.id === fieldId ? { ...field, value } : field
    ))
  }, [])

  return {
    addField,
    removeField,
    updateField
  }
}
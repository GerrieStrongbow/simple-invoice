'use client'

import { useState, useEffect } from 'react'
import { getBusinessProfiles } from '@/lib/supabase/business-profiles'
import { getClients, searchClients } from '@/lib/supabase/clients'
import type { BusinessProfile, Client } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'

interface ContactSelectorModalProps {
  type: 'business' | 'client'
  isOpen: boolean
  onClose: () => void
  onSelect: (fields: SectionField[]) => void
}

export function ContactSelectorModal({
  type,
  isOpen,
  onClose,
  onSelect,
}: ContactSelectorModalProps) {
  const [items, setItems] = useState<(BusinessProfile | Client)[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (!isOpen) return

    const load = async () => {
      setLoading(true)
      try {
        if (type === 'business') {
          const data = await getBusinessProfiles()
          setItems(data)
        } else {
          const data = searchQuery
            ? await searchClients(searchQuery)
            : await getClients()
          setItems(data)
        }
      } catch (error) {
        console.error('Failed to load contacts:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isOpen, type, searchQuery])

  if (!isOpen) return null

  const handleSelect = (item: BusinessProfile | Client) => {
    onSelect(item.fields)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Select {type === 'business' ? 'Business Profile' : 'Client'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Search (clients only) */}
          {type === 'client' && (
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="mt-3 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          )}
        </div>

        <div className="overflow-y-auto max-h-96 p-2">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No {type === 'business' ? 'profiles' : 'clients'} found
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    {item.is_default && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    {item.fields
                      .filter(f => f.value)
                      .slice(0, 2)
                      .map(f => f.value)
                      .join(' • ')}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <a
            href={`/contacts/${type === 'business' ? 'business' : 'clients'}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Manage {type === 'business' ? 'Business Profiles' : 'Clients'} →
          </a>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import {
  getBusinessProfiles,
  createBusinessProfile,
  updateBusinessProfile,
  deleteBusinessProfile,
  setDefaultBusinessProfile,
} from '@/lib/supabase/business-profiles'
import type { BusinessProfile } from '@/lib/supabase/types'
import type { SectionField } from '@/lib/types'
import { ContactForm } from './ContactForm'

export function BusinessProfileList() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const loadProfiles = async () => {
    try {
      setLoading(true)
      const data = await getBusinessProfiles()
      setProfiles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profiles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  const handleCreate = async (data: { name: string; fields: SectionField[] }) => {
    await createBusinessProfile({
      name: data.name,
      fields: data.fields,
      is_default: profiles.length === 0, // First one is default
    })
    setShowAddForm(false)
    await loadProfiles()
  }

  const handleUpdate = async (id: string, data: { name: string; fields: SectionField[] }) => {
    await updateBusinessProfile(id, {
      name: data.name,
      fields: data.fields,
    })
    setEditingId(null)
    await loadProfiles()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this profile?')) return
    await deleteBusinessProfile(id)
    await loadProfiles()
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultBusinessProfile(id)
    await loadProfiles()
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Business Profiles</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Profile
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">New Business Profile</h3>
          <ContactForm
            onSave={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitLabel="Create Profile"
          />
        </div>
      )}

      {profiles.length === 0 && !showAddForm ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No business profiles yet</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-blue-600 hover:underline"
          >
            Create your first profile
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow"
            >
              {editingId === profile.id ? (
                <ContactForm
                  initialName={profile.name}
                  initialFields={profile.fields}
                  onSave={(data) => handleUpdate(profile.id, data)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Update Profile"
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{profile.name}</h3>
                      {profile.is_default && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {profile.fields
                        .filter(f => f.value)
                        .slice(0, 2)
                        .map(f => f.value)
                        .join(' • ')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!profile.is_default && (
                      <button
                        onClick={() => handleSetDefault(profile.id)}
                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => setEditingId(profile.id)}
                      className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

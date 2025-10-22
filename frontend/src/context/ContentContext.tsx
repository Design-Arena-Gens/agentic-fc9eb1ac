import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ContentResponse, Service } from '../types'

interface ContentContextValue {
  content: ContentResponse | null
  loading: boolean
  refresh: () => Promise<void>
  updateBlocks: (updates: Record<string, string>) => Promise<void>
  updateSettings: (updates: Record<string, string>) => Promise<void>
  createService: (payload: Omit<Service, 'id'>) => Promise<void>
  updateService: (id: number, payload: Partial<Service>) => Promise<void>
  deleteService: (id: number) => Promise<void>
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined)

async function sendRequest (url: string, init: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {})
    },
    ...init
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message ?? 'Request failed')
  }
  return await response.json()
}

interface Props {
  children: React.ReactNode
}

export function ContentProvider ({ children }: Props) {
  const [content, setContent] = useState<ContentResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await sendRequest('/api/content', { method: 'GET' }) as ContentResponse
      setContent(data)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateBlocks = useCallback(async (updates: Record<string, string>) => {
    await sendRequest('/api/content/blocks', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    })
    await refresh()
  }, [refresh])

  const updateSettings = useCallback(async (updates: Record<string, string>) => {
    await sendRequest('/api/content/settings', {
      method: 'PUT',
      body: JSON.stringify({ updates })
    })
    await refresh()
  }, [refresh])

  const createService = useCallback(async (payload: Omit<Service, 'id'>) => {
    await sendRequest('/api/content/services', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    await refresh()
  }, [refresh])

  const updateService = useCallback(async (id: number, payload: Partial<Service>) => {
    await sendRequest(`/api/content/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    await refresh()
  }, [refresh])

  const deleteService = useCallback(async (id: number) => {
    await sendRequest(`/api/content/services/${id}`, {
      method: 'DELETE'
    })
    await refresh()
  }, [refresh])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo(() => ({
    content,
    loading,
    refresh,
    updateBlocks,
    updateSettings,
    createService,
    updateService,
    deleteService
  }), [content, loading, refresh, updateBlocks, updateSettings, createService, updateService, deleteService])

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent () {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within ContentProvider')
  }
  return context
}

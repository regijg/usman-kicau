'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (localStorage.getItem('v_tracked') === today) return
    localStorage.setItem('v_tracked', today)
    fetch('/api/track', { method: 'POST' })
  }, [])

  return null
}

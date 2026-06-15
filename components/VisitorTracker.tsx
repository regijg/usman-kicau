'use client'

import { useEffect } from 'react'

export default function VisitorTracker() {
  useEffect(() => {
    if (sessionStorage.getItem('v_tracked')) return
    sessionStorage.setItem('v_tracked', '1')
    fetch('/api/track', { method: 'POST' })
  }, [])

  return null
}

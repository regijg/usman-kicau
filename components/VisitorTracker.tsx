'use client'

import { useEffect } from 'react'

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}

function setCookie(name: string, value: string) {
  const expires = new Date()
  expires.setHours(23, 59, 59, 999) // habis tengah malam hari ini
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

export default function VisitorTracker() {
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    if (getCookie('v_tracked') === today) return
    setCookie('v_tracked', today)
    fetch('/api/track', { method: 'POST' })
  }, [])

  return null
}

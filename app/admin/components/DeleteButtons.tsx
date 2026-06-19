'use client'

import { useState } from 'react'
import { deleteBurung, deletePakan, deleteTestimoni, deleteTransaksi } from '../actions'

export function DeleteBurungButton({ id, nama }: { id: string; nama: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Hapus burung "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setLoading(true)
    await deleteBurung(id)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Hapus'}
    </button>
  )
}

export function DeletePakanButton({ id, nama }: { id: string; nama: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Hapus produk pakan "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setLoading(true)
    await deletePakan(id)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Hapus'}
    </button>
  )
}

export function DeleteTestimoniButton({ id, nama }: { id: string; nama: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Hapus testimoni dari "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setLoading(true)
    await deleteTestimoni(id)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Hapus'}
    </button>
  )
}

export function DeleteTransaksiButton({ id, nama }: { id: string; nama: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm(`Hapus transaksi dari "${nama}"? Semua item di transaksi ini akan ikut terhapus.`)) return
    setLoading(true)
    await deleteTransaksi(id)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Hapus'}
    </button>
  )
}

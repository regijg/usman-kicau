'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBurung(id: string) {
  const supabase = createClient()
  await supabase.from('burung').delete().eq('id', id)
  revalidatePath('/admin/burung')
}

export async function deletePakan(id: string) {
  const supabase = createClient()
  await supabase.from('pakan').delete().eq('id', id)
  revalidatePath('/admin/pakan')
}

export async function deleteTestimoni(id: string) {
  const supabase = createClient()
  await supabase.from('testimoni').delete().eq('id', id)
  revalidatePath('/admin/testimoni')
}

export async function deleteTransaksi(id: string) {
  const supabase = createClient()
  await supabase.from('transaksi').delete().eq('id', id)
  revalidatePath('/admin/transaksi')
}

export async function tambahPembayaran(
  transaksi_id: string,
  jumlah: number,
  tanggal: string,
  catatan: string | null
) {
  const supabase = createClient()

  const { error } = await supabase.from('pembayaran').insert({ transaksi_id, jumlah, tanggal, catatan: catatan || null })
  if (error) throw new Error(error.message)

  // Hitung total sudah dibayar
  const { data: payments } = await supabase.from('pembayaran').select('jumlah').eq('transaksi_id', transaksi_id)
  const totalBayar = (payments ?? []).reduce((sum: number, p: { jumlah: number }) => sum + p.jumlah, 0)

  // Auto-lunas jika sudah cukup
  const { data: trx } = await supabase.from('transaksi').select('total').eq('id', transaksi_id).single()
  if (trx && totalBayar >= trx.total) {
    await supabase.from('transaksi').update({ status: 'Lunas' }).eq('id', transaksi_id)
  }

  revalidatePath('/admin/transaksi')
  revalidatePath(`/admin/transaksi/${transaksi_id}`)
}

export async function hapusPembayaran(id: string, transaksi_id: string) {
  const supabase = createClient()

  await supabase.from('pembayaran').delete().eq('id', id)

  // Recompute: jika sebelumnya Lunas tapi kini kurang, kembalikan ke Belum Lunas
  const { data: payments } = await supabase.from('pembayaran').select('jumlah').eq('transaksi_id', transaksi_id)
  const totalBayar = (payments ?? []).reduce((sum: number, p: { jumlah: number }) => sum + p.jumlah, 0)

  const { data: trx } = await supabase.from('transaksi').select('total, status').eq('id', transaksi_id).single()
  if (trx && trx.status === 'Lunas' && totalBayar < trx.total) {
    await supabase.from('transaksi').update({ status: 'Belum Lunas' }).eq('id', transaksi_id)
  }

  revalidatePath('/admin/transaksi')
  revalidatePath(`/admin/transaksi/${transaksi_id}`)
}

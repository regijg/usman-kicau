import { createClient } from '@/lib/supabase/server'
import VisitorTracker from '@/components/VisitorTracker'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BirdCatalog from '@/components/BirdCatalog'
import FoodProducts from '@/components/FoodProducts'
import Testimoni from '@/components/Testimoni'
import ContactInfo from '@/components/ContactInfo'
import Footer from '@/components/Footer'
import WaFloat from '@/components/WaFloat'

export default async function Home() {
  const supabase = createClient()

  const [{ data: burungList }, { data: pakanList }, { data: testimoniList }] = await Promise.all([
    supabase.from('burung').select('*').order('nama'),
    supabase.from('pakan').select('*').order('nama'),
    supabase.from('testimoni').select('*').eq('aktif', true).order('created_at', { ascending: false }).limit(6),
  ])

  return (
    <main className="min-h-screen">
      <VisitorTracker />
      <Header />
      <Hero />
      <BirdCatalog birds={burungList ?? []} />
      <FoodProducts products={pakanList ?? []} />
      <Testimoni items={testimoniList ?? []} />
      <ContactInfo />
      <Footer />
      <WaFloat />
    </main>
  )
}

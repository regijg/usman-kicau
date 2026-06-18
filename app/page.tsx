import { createClient } from '@/lib/supabase/server'
import VisitorTracker from '@/components/VisitorTracker'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BirdCatalog from '@/components/BirdCatalog'
import FoodProducts from '@/components/FoodProducts'
import ContactInfo from '@/components/ContactInfo'
import Footer from '@/components/Footer'

export default async function Home() {
  const supabase = createClient()

  const [{ data: burungList }, { data: pakanList }] = await Promise.all([
    supabase.from('burung').select('*').order('nama'),
    supabase.from('pakan').select('*').order('nama'),
  ])

  return (
    <main className="min-h-screen">
      <VisitorTracker />
      <Header />
      <Hero />
      <BirdCatalog birds={burungList ?? []} />
      <FoodProducts products={pakanList ?? []} />
      <ContactInfo />
      <Footer />
    </main>
  )
}

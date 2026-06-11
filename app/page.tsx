import Header from '@/components/Header'
import Hero from '@/components/Hero'
import BirdCatalog from '@/components/BirdCatalog'
import FoodProducts from '@/components/FoodProducts'
import ContactInfo from '@/components/ContactInfo'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BirdCatalog />
      <FoodProducts />
      <ContactInfo />
      <Footer />
    </main>
  )
}

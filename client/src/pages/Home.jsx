import CallToAction from '../components/home/CallToAction'
import Delivery from '../components/home/Delivery'
import Demos from '../components/home/Demos'
import Faq from '../components/home/Faq'
import Features from '../components/home/Features'
import Footer from '../components/home/Footer'
import Hero from '../components/home/Hero'
import Navbar from '../components/home/Navbar'
import Pricing from '../components/home/Pricing'
import Requirements from '../components/home/Requirements'
import Statement from '../components/home/Statement'
import Testimonials from '../components/home/Testimonials'

// The home page is just the sections stacked in order.
function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Demos />
        <Features />
        <Pricing />
        <Delivery />
        <Requirements />
        <Testimonials />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}

export default Home

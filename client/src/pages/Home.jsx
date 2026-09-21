import CallToAction from '../components/home/CallToAction'
import Faq from '../components/home/Faq'
import Features from '../components/home/Features'
import Footer from '../components/home/Footer'
import Hero from '../components/home/Hero'
import Highlights from '../components/home/Highlights'
import HowItWorks from '../components/home/HowItWorks'
import Navbar from '../components/home/Navbar'
import Requirements from '../components/home/Requirements'
import '../styles/home.css'

// The home page is just the sections stacked in order.
function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Features />
        <HowItWorks />
        <Requirements />
        <Faq />
        <CallToAction />
      </main>
      <Footer />
    </>
  )
}

export default Home

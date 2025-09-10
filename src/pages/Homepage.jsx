import React from 'react'
import LandingSection from '../components/home/LandingSection/LandingSection'
import Navbar from '../components/home/Navbar/Navbar'
import FeaturesSection from '../components/home/FeaturesSection/FeaturesSection'
import ContactFormSection from '../components/home/ContactFormSection/ContactFormSection' 
import Footer from '../components/home/Footer/Footer'
import ChatBot from '../components/ChatBot'


const Homepage = () => {
  return (
    <div>
      <Navbar />
      <LandingSection />
      <FeaturesSection />
     
      <ContactFormSection />
      <Footer />
    </div>
  )
}

export default Homepage

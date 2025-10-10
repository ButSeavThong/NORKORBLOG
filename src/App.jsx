import './App.css'
import HeroSection from './components/layouts/hero-section'
import { Analytics } from '@vercel/analytics/react';
function App() {

  return (
    <>
    <HeroSection/>
    <Analytics />
    </>
  ) 
}

export default App

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

export default function MyHero() {
  const heroRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width
        const y = (e.clientY - rect.top) / rect.height
        setMousePos({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const mouseX = (mousePos.x - 0.5) * 30
  const mouseY = (mousePos.y - 0.5) * 30

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-[#2563EB]/70 via-[#FF7F50]/50 to-[#F59E0B]/40 overflow-hidden"
    >
      {/* Animated background circles */}
      <motion.div
        className="absolute w-72 h-72 bg-[#2563EB]/20 rounded-full top-20 left-20 blur-3xl"
        animate={{ x: mouseX, y: mouseY }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-[#FF7F50]/20 rounded-full top-40 right-24 blur-2xl"
        animate={{ x: -mouseX / 2, y: -mouseY / 2 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-[#F59E0B]/15 rounded-full bottom-32 left-1/3 blur-3xl"
        animate={{ x: mouseX / 2, y: mouseY / 2 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-3xl px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6">
          Share Your Ideas & Knowledge
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8">
          Explore, write, and publish insightful articles about technology, creativity, and innovation.
        </p>
        <button className="flex items-center gap-2 bg-[#2563EB] hover:bg-[#1e4db7] text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300">
          <BookOpen className="w-6 h-6" /> CREATE YOUR BLOG
        </button>
      </div>
    </section>
  )
}

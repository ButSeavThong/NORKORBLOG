import { motion } from "framer-motion";
import { ArrowRight, PencilLine } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/image/hero-bg.jpg" // 👈 replace with your background image path
          alt="Tech Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/70 via-black/80 to-[#FF7F50]/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center px-6">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-[#2563EB] via-[#F59E0B] to-[#FF7F50] bg-clip-text text-transparent"
        >
          Discover Ideas & Technology That Shape Tomorrow
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
        >
          Explore blogs, insights, and creative thoughts that inspire innovation
          and push the boundaries of technology.
        </motion.p>

        {/* Buttons with staggered animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <NavLink
              to="/blog"
              className="px-6 py-3 bg-[#2563EB] hover:bg-blue-700 rounded-xl shadow-lg text-lg font-medium flex items-center gap-2 transition-transform transform hover:-translate-y-1"
            >
              Read Blogs <ArrowRight className="w-5 h-5" />
            </NavLink>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <NavLink
              to="/about"
              className="px-6 py-3 border border-[#FF7F50] text-[#FF7F50] rounded-xl text-lg font-medium hover:bg-[#FF7F50] hover:text-white transition-all duration-300"
            >
              Learn More
            </NavLink>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <NavLink
              to="/create-blog"
              className="px-6 py-3 bg-[#F59E0B] hover:bg-yellow-600 rounded-xl shadow-lg text-lg font-medium flex items-center gap-2 transition-transform transform hover:-translate-y-1"
            >
              <PencilLine className="w-5 h-5" />
              Create Your Blog
            </NavLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

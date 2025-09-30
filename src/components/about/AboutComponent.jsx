// CamPostHome.js
import React from "react";
import { FaGithub, FaFacebook, FaLinkedin, FaEnvelope, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router";

// SocialIcon component
function SocialIcon({ icon: Icon, url }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xl p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
    >
      <Icon />
    </a>
  );
}

const CamPostHome = () => {
  const mentors = [
    {
      id: 1,
      name: "Sin SreyPhea",
      role: "Senior Developer",
      image: "/mentor.png",
      socialLinks: [
        { icon: FaGithub, url: "https://github.com" },
        { icon: FaLinkedin, url: "https://linkedin.com" },
        { icon: FaFacebook, url: "https://facebook.com" },
        { icon: FaEnvelope, url: "mailto:sinsrey@example.com" },
      ],
    },
    {
      id: 2,
      name: "But SeavThong",
      role: "Junior Developer",
      image: "/student.png",
      socialLinks: [
        { icon: FaGithub, url: "https://github.com" },
        { icon: FaLinkedin, url: "https://linkedin.com" },
        { icon: FaFacebook, url: "https://web.facebook.com/sev.thong.5" },
        { icon: FaEnvelope, url: "mailto:seavthang@example.com" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8 lg:p-12 xl:p-[100px]">
      {/* Header Section */}
      <section className="text-center py-8 md:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Education and Technology Blog
        </h1>
        <p className="mt-4 text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
          Share your knowledge and experiences in education and technology.
          Learn from others, inspire change.
        </p>
        <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center mx-auto">
          Get Started <FaArrowRight className="ml-2" />
        </button>
        
      </section>

      {/* Join Us Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="mx-auto mb-4 w-24 h-24 md:w-32 md:h-32 bg-blue-100 rounded-full flex items-center justify-center">
            <img
              src="/learn.png"
              alt="Learn"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-indigo-600 mb-2">
            Learn
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Explore shared experiences and insights to grow your understanding.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
          <div className="mx-auto mb-4 w-24 h-24 md:w-32 md:h-32 bg-pink-100 rounded-full flex items-center justify-center">
            <img
              src="/share.png"
              alt="Share"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold text-pink-600 mb-2">
            Share
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Post your own stories and ideas to help others learn and grow.
          </p>
        </div>
      </section>

      {/* How Section */}
      <section className="py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 md:mb-8">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4 w-full h-40 bg-blue-100 rounded-lg flex items-center justify-center">
              <img
                src="/how.png"
                alt="How to Learn"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              To Learn
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>Sign up or log in</li>
              <li>Read posts</li>
              <li>Comment your opinion</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-4 w-full h-40 bg-purple-100 rounded-lg flex items-center justify-center">
              <img
                src="/post.png"
                alt="How to Post"
                className="w-full h-full object-contain p-4"
              />
            </div>
            <h3 className="text-xl font-semibold text-purple-600 mb-2">
              To Post
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm md:text-base">
              <li>Sign up or log in</li>
              <li>Write your post</li>
              <li>Add hashtags and publish</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Mentor & Student</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {mentors.map((mentor) => (
            <div key={mentor.id} className="relative group">
              {/* Top-left corner line */}
              <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg z-10"></div>
              {/* Bottom-right corner line */}
              <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-orange-500 rounded-br-lg z-10"></div>

              <div className="relative bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col sm:flex-row items-center gap-4 md:gap-6 z-20 transition-all duration-300 group-hover:scale-[1.02]">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden -mt-8 flex-shrink-0">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg md:text-xl font-bold">{mentor.name}</h3>
                  <p className="text-orange-500 font-medium mb-2 md:mb-3">{mentor.role}</p>
                  <div className="flex justify-center sm:justify-start space-x-2">
                    {mentor.socialLinks.map((social, idx) => (
                      <SocialIcon key={idx} icon={social.icon} url={social.url} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Ready to Join Our Community?
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Start sharing your knowledge or learn from experts in education and technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <NavLink to='/register' className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300">
            Sign Up Now
          </NavLink>
          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-300">
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
};

export default CamPostHome;
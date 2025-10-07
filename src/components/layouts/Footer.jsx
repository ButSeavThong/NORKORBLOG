import React from "react";
import { FaTelegramPlane, FaFacebookF, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6 shadow-inner">
      <div className="mx-auto text-center px-[150px]">
        {/* Social icons */}
        <div className="flex justify-center space-x-6 text-2xl mb-4">
          <a
            href="https://t.me/yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-blue-500 transition-colors duration-300"
          >
            <FaTelegramPlane className="mr-2" /> Telegram
          </a>
          <a
            href="https://facebook.com/yourpage"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
          >
            <FaFacebookF className="mr-2" /> Facebook
          </a>
          <a
            href="https://github.com/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-black transition-colors duration-300"
          >
            <FaGithub className="mr-2" /> Github
          </a>
        </div>

        {/* Divider */}
        <hr className="border-t border-gray-300 mb-4 " />

        {/* Copyright */}
        <p className="text-sm text-gray-600">
          © Copyright 2025, All Rights Reserved by NORKORBLOG
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { Github, Twitter, Linkedin, Mail, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn', href: 'https://www.linkedin.com/in/th%E1%BB%8D-ho%C3%A0ng-c%C3%B4ng-12322b260/' },
    { icon: <Mail className="w-5 h-5" />, label: 'Email', href: 'mailto:thoqb123456@gmail.com' }
  ];

  const quickLinks = [
    { label: 'About', href: '#' },
    { label: 'Projects', href: '#' },
    { label: 'Experience', href: '#' },
    { label: 'Blog', href: '#' }
  ];

  return (
    <footer className="bg-[#FAF9F6] border-t border-gray-200 h-screen flex items-center justify-between w-full ">
      <div className=" mx-auto">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Let's Build Something Together
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Open for collaborations and interesting projects.
              Feel free to reach out if you want to create something amazing.
            </p>
            <a
              href="mailto:thoqb13456@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
            >
              Get in Touch
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
              <ul className="space-y-3">
                {socialLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                    >
                      {link.icon}
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-900 rounded-full"></span>
              <span className="font-semibold text-gray-900">Portfolio</span>
            </div>
            <p className="text-gray-600 text-sm">
              © {currentYear} All rights reserved. Built with passion.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
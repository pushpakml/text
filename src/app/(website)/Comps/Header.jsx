import React from 'react'

function Header() {
  return (
    <div>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img src="/photo/logo.jpg" className="w-14 h-14 rounded-full object-cover" alt="Texas Academy" />
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
                Texas Academy
              </h1>
            </a>
            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
              <li><a href="/" className="hover:text-blue-600">Home</a></li>
              <li><a href="/events" className="hover:text-blue-600">Events</a></li>
              <li><a href="/gallery" className="hover:text-blue-600">Gallery</a></li>
              <li><a href="#facility" className="hover:text-blue-600">Facilities</a></li>
              <li><a href="#message" className="hover:text-blue-600">Owner's Message</a></li>
              <li><a href="/about" className="hover:text-blue-600">About</a></li>
              <li>
                <a href="#contact" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full transition">
                  Contact Us
                </a>
              </li>
            </ul>
            {/* Mobile Button */}
            <button id="menu-btn" className="lg:hidden text-3xl">
              ☰
            </button>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Header

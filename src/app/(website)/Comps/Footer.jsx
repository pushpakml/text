import React from 'react'

function Footer() {
  return (
    <div>
      <footer className="bg-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* School Info */}
          <div>
            <img src="/photo/logo.jpg" className="w-20 h-20 rounded-full border-4 border-white mb-4" alt="Texas Academy" />
            <h2 className="text-2xl font-bold mb-3">
              Texas Academy
            </h2>
            <p className="text-gray-300 leading-7">
              Character Building & Qualitative Education.
            </p>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-yellow-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Events</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Gallery</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Facilities</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Message</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition">Contact</a></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>📍 Kathmandu, Nepal</li>
              <li>📞 +977 9854036790</li>
              <li>✉️ texasacademysarlahi@gmail.com</li>
              <li>🕒 Sun - Fri : 9:00 AM - 5:00 PM</li>
            </ul>
          </div>
          {/* Social Media */}
          <div>
            <h3 className="text-xl font-semibold mb-4 border-b border-blue-700 pb-2">
              Connect With Us
            </h3>
            <div className="flex gap-4 mt-4">
              <a href="https://www.facebook.com/teksasa.ekedemi" className="w-11 h-11 rounded-full flex items-center justify-center transition">
                <img src="/photo/facebook.avif" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full flex items-center justify-center transition">
                <img src="/photo/instagram.avif" />
              </a>
              <a href="https://www.tiktok.com/@texasacademysarlahi?fbclid=IwY2xjawTpDtNwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMUxscWpaaVdWanltTTFmUHVzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe40JJVExBUKnJl-5EXFfNAWCxG1eOVLetoxgYPoptThScVJlDyQT6EV6vLbs_aem_S1uOlSphgZ6QayrbaDOLjQ" className="w-11 h-11  rounded-full flex items-center justify-center transition">
                <img src="/photo/tiktok.avif" />
              </a>
              <a href="#" className="w-11 h-11 rounded-full flex items-center justify-center  transition">
                <img src="/photo/twitter.webp"/>
              </a>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-blue-800">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-center md:text-left">
              © 2026 Texas Academy. All Rights Reserved.
            </p>
            <p className="text-gray-400 text-sm mt-3 md:mt-0">
              Designed &amp; Developed with care
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

export default Footer

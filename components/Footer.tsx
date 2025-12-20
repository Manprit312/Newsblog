import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#002866] text-white mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* About Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-yellow">NewsBlogs</h3>
            </Link>
            <p className="text-white/80 text-sm sm:text-base mb-4">
              Your trusted source for the latest news, updates, and immersive web stories.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary-yellow rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary-yellow rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary-yellow rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-primary-yellow rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-primary-yellow">Quick Links</h4>
            <ul className="space-y-2 text-white/80 text-sm sm:text-base">
              <li>
                <Link href="/" className="hover:text-primary-yellow transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-primary-yellow transition-colors">
                  News & Blogs
                </Link>
              </li>
              <li>
                <Link href="/web-stories" className="hover:text-primary-yellow transition-colors">
                  Web Stories
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-yellow transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-primary-yellow transition-colors">
                  Advertise
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-yellow transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-primary-yellow">Categories</h4>
            <ul className="space-y-2 text-white/80 text-sm sm:text-base">
              <li>
                <Link href="/blogs" className="hover:text-primary-yellow transition-colors">
                  All News
                </Link>
              </li>
              <li>
                <Link href="/blogs?featured=true" className="hover:text-primary-yellow transition-colors">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/web-stories" className="hover:text-primary-yellow transition-colors">
                  Web Stories
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-primary-yellow transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-4 text-primary-yellow">Contact Info</h4>
            <ul className="space-y-3 text-white/80 text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0 text-primary-yellow" />
                <a href="tel:+919876543210" className="hover:text-primary-yellow transition-colors">
                  +91-98765-43210
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary-yellow" />
                <a href="mailto:contact@newsblogs.com" className="hover:text-primary-yellow transition-colors break-all">
                  contact@newsblogs.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0 text-primary-yellow" />
                <a href="mailto:advertise@newsblogs.com" className="hover:text-primary-yellow transition-colors break-all">
                  advertise@newsblogs.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-primary-yellow" />
                <span className="text-white/80">
                  NewsBlogs Headquarters<br />
                  Your City, Your State
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-xs sm:text-sm">
            <p>&copy; {currentYear} NewsBlogs. All rights reserved.</p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="/about" className="hover:text-primary-yellow transition-colors">
                About
              </Link>
              <Link href="/advertise" className="hover:text-primary-yellow transition-colors">
                Advertise
              </Link>
              <Link href="/contact" className="hover:text-primary-yellow transition-colors">
                Contact
              </Link>
              <Link href="/admin/login" className="hover:text-primary-yellow transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
















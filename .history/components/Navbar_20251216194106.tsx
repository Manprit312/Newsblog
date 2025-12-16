'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, Lock, Facebook, Twitter, Instagram, Linkedin, Phone, Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Category {
  name: string;
  href: string;
  subcategories?: { name: string; href: string }[];
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  // Close dropdowns when pathname changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileDropdown(null);
  }, [pathname]);

  const categories: Category[] = [
    { name: 'World', href: '/blogs?category=World' },
    { name: 'Politics', href: '/blogs?category=Politics' },
    { name: 'Business', href: '/blogs?category=Business' },
    { name: 'Science', href: '/blogs?category=Science' },
    {
      name: 'Tech',
      href: '/blogs?category=Tech',
      subcategories: [
        { name: 'AI & ML', href: '/blogs?category=Tech&subcategory=AI & ML' },
        { name: 'Mobile', href: '/blogs?category=Tech&subcategory=Mobile' },
        { name: 'Web', href: '/blogs?category=Tech&subcategory=Web' },
        { name: 'Gadgets', href: '/blogs?category=Tech&subcategory=Gadgets' },
      ],
    },
    {
      name: 'Entertainment',
      href: '/blogs?category=Entertainment',
      subcategories: [
        { name: 'Bollywood', href: '/blogs?category=Entertainment&subcategory=Bollywood' },
        { name: 'Hollywood', href: '/blogs?category=Entertainment&subcategory=Hollywood' },
        { name: 'TV Shows', href: '/blogs?category=Entertainment&subcategory=TV Shows' },
        { name: 'Music', href: '/blogs?category=Entertainment&subcategory=Music' },
      ],
    },
    {
      name: 'Lifestyle',
      href: '/blogs?category=Lifestyle',
      subcategories: [
        { name: 'Health', href: '/blogs?category=Lifestyle&subcategory=Health' },
        { name: 'Fashion', href: '/blogs?category=Lifestyle&subcategory=Fashion' },
        { name: 'Food', href: '/blogs?category=Lifestyle&subcategory=Food' },
      ],
    },
    { name: 'Sports', href: '/blogs?category=Sports' },
    { name: 'Education', href: '/blogs?category=Education' },
    {
      name: 'State',
      href: '/blogs?category=State',
      subcategories: [
        { name: 'Madhya Pradesh', href: '/blogs?category=State&subcategory=Madhya Pradesh' },
        { name: 'Maharashtra', href: '/blogs?category=State&subcategory=Maharashtra' },
        { name: 'Uttar Pradesh', href: '/blogs?category=State&subcategory=Uttar Pradesh' },
      ],
    },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Hide the public site header on all admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/blogs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top Bar - Dark Purple */}
      <div className="bg-[#4a148c] text-white py-2 text-xs sm:text-sm">
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <Link href="/" className="hover:text-yellow-300 transition-colors whitespace-nowrap">Home</Link>
              <Link href="/about" className="hover:text-yellow-300 transition-colors whitespace-nowrap hidden sm:inline">About Us</Link>
              <Link href="/advertise" className="hover:text-yellow-300 transition-colors whitespace-nowrap hidden md:inline">Advertise</Link>
              <Link href="/contact" className="hover:text-yellow-300 transition-colors whitespace-nowrap">Contact</Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="hidden lg:inline text-xs">{currentDate}</span>
              <div className="flex items-center gap-1 sm:gap-2">
                <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Facebook">
                  <Facebook className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Twitter">
                  <Twitter className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Instagram">
                  <Instagram className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
                <a href="#" className="hover:text-yellow-300 transition-colors hidden sm:inline" aria-label="LinkedIn">
                  <Linkedin className="w-3 h-3 sm:w-4 sm:h-4" />
                </a>
              </div>
              <button
                onClick={() => {
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) searchInput.focus();
                }}
                className="hover:text-yellow-300 transition-colors"
                aria-label="Search"
              >
                <Search className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <Link href="/admin/login" className="flex items-center gap-1 hover:text-yellow-300 transition-colors whitespace-nowrap">
                <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - Clean NewsLine Style */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm dark:bg-gray-900 dark:border-gray-800 overflow-visible">
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl overflow-visible">
          {/* Logo Section with Search */}
          <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200 overflow-visible">
            {/* Logo with Red Circle Icon */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg sm:text-xl">N</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl md:text-3xl font-normal text-gray-900 leading-tight dark:text-gray-50">News</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight dark:text-gray-50">Line</span>
              </div>
            </Link>

            {/* Search and Subscribe */}
            <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>
              <button className="bg-yellow-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-yellow-700 transition-colors text-sm">
                Subscribe
              </button>
            </div>

            {/* Right Side - Utility Icons */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+919876543210"
                className="hidden md:inline-flex items-center justify-center rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                aria-label="Call us"
              >
                <Phone className="mr-1 h-4 w-4" />
                <span>+91-98765-43210</span>
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 rounded transition-colors dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            </div>
          </div>

          {/* Navigation Links - Clean Horizontal Menu */}
          <div className="hidden lg:flex items-center justify-center gap-4 xl:gap-6 py-3" >
            <Link
              href="/"
              className={`px-2 py-2 font-bold text-sm uppercase transition-colors border-b-2 whitespace-nowrap ${
                isActive('/')
                  ? 'text-gray-900 border-yellow-600 dark:text-yellow-400'
                  : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-yellow-600 dark:text-gray-200 dark:hover:text-yellow-400'
              }`}
            >
              HOME
            </Link>
            
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                style={{ zIndex: openDropdown === category.name ? 1000 : 'auto' }}
                onMouseEnter={() => setOpenDropdown(category.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={category.href}
                  onClick={() => {
                    // Close dropdown when main category is clicked
                    if (!category.subcategories) {
                      setOpenDropdown(null);
                    }
                  }}
                  className={`px-2 py-2 font-bold text-sm uppercase transition-colors border-b-2 flex items-center gap-1 whitespace-nowrap ${
                    pathname.includes(category.href.split('?')[0])
                      ? 'text-gray-900 border-yellow-600 dark:text-yellow-400'
                      : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-yellow-600 dark:text-gray-200 dark:hover:text-yellow-400'
                  }`}
                >
                  {category.name.toUpperCase()}
                  {category.subcategories && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''}`} />
                  )}
                </Link>
                
                {/* Dropdown Menu */}
                {category.subcategories && openDropdown === category.name && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-md py-2 min-w-[200px] z-[1000] border border-gray-200 dark:bg-gray-900 dark:border-gray-700"
                    style={{ position: 'absolute', zIndex: 1000 }}
                    onMouseEnter={() => setOpenDropdown(category.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-yellow-400"
                        onClick={() => {
                          setOpenDropdown(null);
                          // Small delay to ensure navigation happens
                          setTimeout(() => setOpenDropdown(null), 100);
                        }}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <Link
              href="/blogs"
              className={`px-2 py-2 font-bold text-sm uppercase transition-colors border-b-2 whitespace-nowrap ${
                isActive('/blogs')
                  ? 'text-gray-900 border-yellow-600 dark:text-yellow-400'
                  : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-yellow-600 dark:text-gray-200 dark:hover:text-yellow-400'
              }`}
            >
              NEWS
            </Link>
            
            <Link
              href="/web-stories"
              className={`px-2 py-2 font-bold text-sm uppercase transition-colors border-b-2 whitespace-nowrap ${
                isActive('/web-stories')
                  ? 'text-gray-900 border-yellow-600 dark:text-yellow-400'
                  : 'text-gray-700 border-transparent hover:text-gray-900 hover:border-yellow-600 dark:text-gray-200 dark:hover:text-yellow-400'
              }`}
            >
              WEB STORIES
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
                  isActive('/')
                    ? 'text-yellow-600 border-yellow-600 bg-gray-50'
                    : 'text-gray-700 border-transparent hover:bg-gray-50 hover:text-yellow-600'
                }`}
              >
                Home
              </Link>
              
              {categories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between">
                  <Link
                    href={category.href}
                      onClick={() => {
                        if (!category.subcategories) {
                          setMobileMenuOpen(false);
                        }
                      }}
                      className={`flex-1 block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
                      pathname.includes(category.href.split('?')[0])
                          ? 'text-yellow-600 border-yellow-600 bg-gray-50'
                          : 'text-gray-700 border-transparent hover:bg-gray-50 hover:text-yellow-600'
                    }`}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories && (
                      <button
                        onClick={() => setMobileDropdown(mobileDropdown === category.name ? null : category.name)}
                        className="px-4 py-3 text-gray-700 hover:text-yellow-600 transition-colors"
                        aria-label="Toggle submenu"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === category.name ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  {category.subcategories && mobileDropdown === category.name && (
                    <div className="pl-6 space-y-1 bg-gray-50">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileDropdown(null);
                          }}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-yellow-600 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <Link
                href="/blogs"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
                  isActive('/blogs')
                    ? 'text-yellow-600 border-yellow-600 bg-gray-50'
                    : 'text-gray-700 border-transparent hover:bg-gray-50 hover:text-yellow-600'
                }`}
              >
                News
              </Link>

              <Link
                href="/web-stories"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
                  isActive('/web-stories')
                    ? 'text-yellow-600 border-yellow-600 bg-gray-50'
                    : 'text-gray-700 border-transparent hover:bg-gray-50 hover:text-yellow-600'
                }`}
              >
                Web Stories
              </Link>

              {/* Mobile Admin Link */}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 font-semibold text-sm text-gray-700 hover:bg-gray-50 hover:text-yellow-600 transition-colors border-t border-gray-200 mt-4 pt-4"
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}


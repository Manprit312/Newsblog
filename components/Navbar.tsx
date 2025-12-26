'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Menu, X, ChevronDown, Lock, Facebook, Twitter, Instagram, Linkedin, Phone, Moon, Sun, Bell, Radio, Newspaper, Wind } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface Category {
  name: string;
  href: string;
  subcategories?: { name: string; href: string }[];
}

interface CategoryData {
  id: number;
  name: string;
  slug: string;
  subcategories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isMouseOverDropdown = useRef(false);
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories?active=true');
        const data = await response.json();
        
        if (data.success && data.categories) {
          const formattedCategories: Category[] = data.categories.map((cat: CategoryData) => ({
            name: cat.name,
            href: `/blogs?category=${cat.slug}`,
            subcategories: cat.subcategories.length > 0
              ? cat.subcategories.map((sub) => ({
                  name: sub.name,
                  href: `/blogs?category=${cat.slug}&subcategory=${sub.slug}`,
                }))
              : undefined,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback to empty array on error
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdowns when pathname changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileDropdown(null);
  }, [pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

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
      {/* Top Bar - White Background with Links (Aaj Tak Style) */}
      <div className="bg-white border-b border-gray-200 py-2 text-xs">
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs">
              <Link href="/" className="text-gray-900 hover:text-yellow-600 transition-colors whitespace-nowrap font-medium">NewsBlogs</Link>
              <span className="text-gray-400">|</span>
              <Link href="/blogs" className="text-gray-700 hover:text-yellow-600 transition-colors whitespace-nowrap hidden sm:inline">E-Paper</Link>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <Link href="/web-stories" className="text-gray-700 hover:text-yellow-600 transition-colors whitespace-nowrap hidden md:inline">Web Stories</Link>
              <span className="text-gray-400 hidden md:inline">|</span>
              <Link href="/about" className="text-gray-700 hover:text-yellow-600 transition-colors whitespace-nowrap hidden lg:inline">About</Link>
              <span className="text-gray-400 hidden lg:inline">|</span>
              <Link href="/contact" className="text-gray-700 hover:text-yellow-600 transition-colors whitespace-nowrap hidden lg:inline">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/login" className="bg-yellow-600 text-white px-4 py-1.5 rounded text-xs font-semibold hover:bg-yellow-700 transition-colors flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - Dark Blue Background with Logo and Navigation in One Row */}
      <div className="bg-[#1e3a8a] text-white sticky top-0 z-50" style={{ overflow: 'visible' }}>
        <div className="container mx-auto px-2 sm:px-4 max-w-7xl" style={{ overflow: 'visible' }}>
          <div className="flex items-center justify-between py-2 sm:py-3 gap-2 relative" style={{ overflow: 'visible' }}>
            {/* Left Side - Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 hover:bg-blue-700 rounded transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo with Yellow Accent Bar */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-1 h-8 sm:h-10 md:h-12 bg-yellow-600 rounded hidden sm:block"></div>
              <Link href="/" className="flex items-center gap-1 sm:gap-2 group">
                <div className="relative">
                  <Image
                    src="/images/logo.jpeg"
                    alt="NewsBlogs Logo"
                    width={50}
                    height={50}
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white leading-tight">News</span>
                  <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-tight">Blogs</span>
            </div>
              </Link>
          </div>

            {/* Navigation Links - In Same Row with proper overflow handling */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-1 justify-center min-w-0 relative" style={{ overflow: 'visible' }}>
              <div className="flex items-center gap-2 xl:gap-3 overflow-x-auto scrollbar-hide max-w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <Link
              href="/"
                className={`px-2 xl:px-3 py-2 font-semibold text-xs xl:text-sm transition-colors whitespace-nowrap relative flex-shrink-0 ${
                isActive('/')
                    ? 'text-white border-b-2 border-yellow-600'
                    : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              }`}
            >
              HOME
            </Link>
            
            {loadingCategories ? (
                <div className="px-2 xl:px-3 py-2 text-xs xl:text-sm text-white/70 flex-shrink-0">Loading...</div>
            ) : (
              categories.map((category) => (
              <div
                key={category.name}
                  className="relative group flex-shrink-0"
                style={{ zIndex: openDropdown === category.name ? 1000 : 'auto' }}
                ref={(el) => {
                  if (el) categoryRefs.current[category.name] = el;
                }}
                onMouseEnter={() => {
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                  setOpenDropdown(category.name);
                  // Calculate position for dropdown using getBoundingClientRect
                  if (typeof window !== 'undefined' && categoryRefs.current[category.name]) {
                    const element = categoryRefs.current[category.name];
                    if (element) {
                      const rect = element.getBoundingClientRect();
                      setDropdownPosition({
                        top: rect.bottom,
                        left: rect.left
                      });
                    }
                  }
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    // Only close if mouse is not over dropdown
                    if (!isMouseOverDropdown.current) {
                    setOpenDropdown(null);
                      setDropdownPosition(null);
                    }
                  }, 200);
                  setDropdownTimeout(timeout);
                }}
              >
                <Link
                  href={category.href}
                  onClick={(e) => {
                    if (category.subcategories && category.subcategories.length > 0) {
                      e.preventDefault();
                    } else {
                      setOpenDropdown(null);
                      setDropdownPosition(null);
                    }
                  }}
                    className={`px-2 xl:px-3 py-2 font-semibold text-xs xl:text-sm transition-colors flex items-center gap-1 whitespace-nowrap relative ${
                    pathname.includes(category.href.split('?')[0])
                        ? 'text-white border-b-2 border-yellow-600'
                        : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
                  }`}
                >
                  {category.name.toUpperCase()}
                  {category.subcategories && (
                    <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === category.name ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              </div>
              ))
            )}
            
            <Link
              href="/blogs"
                className={`px-2 xl:px-3 py-2 font-semibold text-xs xl:text-sm transition-colors whitespace-nowrap relative flex-shrink-0 ${
                isActive('/blogs')
                    ? 'text-white border-b-2 border-yellow-600'
                    : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              }`}
            >
              NEWS
            </Link>
            
            <Link
              href="/web-stories"
                className={`px-2 xl:px-3 py-2 font-semibold text-xs xl:text-sm transition-colors whitespace-nowrap relative flex-shrink-0 ${
                isActive('/web-stories')
                    ? 'text-white border-b-2 border-yellow-600'
                    : 'text-white/90 hover:text-white hover:border-b-2 hover:border-white/50'
              }`}
            >
              WEB STORIES
            </Link>
          </div>
        </div>

        {/* Dropdown Menus - Rendered as Portal to appear above everything */}
        {typeof window !== 'undefined' && openDropdown && dropdownPosition && categories.find(c => c.name === openDropdown && c.subcategories && c.subcategories.length > 0) && createPortal(
          <div 
            ref={dropdownRef}
            className="dropdown-menu-portal fixed bg-white shadow-2xl rounded-b-md py-2 min-w-[220px] border border-gray-200"
            style={{ 
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 99999,
              transform: 'translateZ(0)'
            }}
            onMouseEnter={() => {
              // Mark that mouse is over dropdown
              isMouseOverDropdown.current = true;
              // Clear any pending timeout when entering dropdown
              if (dropdownTimeout) {
                clearTimeout(dropdownTimeout);
                setDropdownTimeout(null);
              }
            }}
            onMouseLeave={() => {
              // Mark that mouse left dropdown
              isMouseOverDropdown.current = false;
              // Add a small delay before closing to allow moving back to link
              const timeout = setTimeout(() => {
                if (!isMouseOverDropdown.current) {
                  setOpenDropdown(null);
                  setDropdownPosition(null);
                }
              }, 200);
              setDropdownTimeout(timeout);
            }}
          >
            {categories.find(c => c.name === openDropdown)?.subcategories?.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className="block px-4 py-2.5 text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors text-sm"
                onClick={() => {
                  setOpenDropdown(null);
                  setDropdownPosition(null);
                }}
              >
                {sub.name}
              </Link>
            ))}
          </div>,
          document.body
        )}

            {/* Right Side - Utility Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* E-Paper */}
              <Link href="/blogs" className="hidden lg:flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
                <div className="relative">
                  <Newspaper className="w-4 h-4 xl:w-5 xl:h-5" />
                  <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-[7px] xl:text-[8px] px-0.5 xl:px-1 rounded">New!</span>
                </div>
                <span className="text-[9px] xl:text-[10px] mt-0.5">E-PAPER</span>
              </Link>

              {/* AQI */}
              <button 
                onClick={() => window.open('https://aqicn.org/map/india/', '_blank')}
                className="hidden xl:flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Wind className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="text-[9px] xl:text-[10px] mt-0.5">AQI</span>
              </button>

              {/* Notifications */}
              <button 
                onClick={() => {
                  // TODO: Implement notifications functionality
                  alert('Notifications feature coming soon!');
                }}
                className="relative p-1.5 xl:p-2 hover:bg-blue-700 rounded transition-colors" 
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>

              {/* Radio */}
              <button
                onClick={() => {
                  // TODO: Implement radio functionality
                  alert('Radio feature coming soon!');
                }}
                className="hidden 2xl:flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
              >
                <Radio className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="text-[9px] xl:text-[10px] mt-0.5">RADIO</span>
              </button>

              {/* LIVE */}
              <Link 
                href="/blogs?featured=true"
                className="hidden xl:flex items-center bg-yellow-600 px-1.5 xl:px-2 py-0.5 xl:py-1 rounded cursor-pointer hover:bg-yellow-700 transition-colors"
              >
                <div className="w-1.5 h-1.5 xl:w-2 xl:h-2 bg-white rounded-full mr-0.5 xl:mr-1 animate-pulse"></div>
                <span className="text-[10px] xl:text-xs font-semibold">LIVE</span>
              </Link>

              {/* Search */}
              <button
                onClick={() => {
                  const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    // If search input doesn't exist, show search modal or navigate to search page
                    window.location.href = '/blogs?search=';
                  }
                }}
                className="p-1.5 xl:p-2 hover:bg-blue-700 rounded transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 xl:w-5 xl:h-5" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="hidden lg:flex p-1.5 xl:p-2 hover:bg-blue-700 rounded transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 xl:w-5 xl:h-5" />
                ) : (
                  <Moon className="w-4 h-4 xl:w-5 xl:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Menu - Dark Blue Background */}
      <div className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-[#1e3a8a] text-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="container mx-auto px-4 py-4 space-y-1">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-blue-700 rounded transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-600 rounded-l-md z-10"></div>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-12 border border-blue-500 rounded-md text-gray-800 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all bg-white"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </form>

          {/* Mobile Nav Links */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
              isActive('/')
                ? 'text-white border-yellow-600 bg-blue-700'
                : 'text-white/90 border-transparent hover:bg-blue-700 hover:text-white'
            }`}
          >
            Home
          </Link>
          
          {loadingCategories ? (
            <div className="px-4 py-3 text-sm text-white/70">Loading categories...</div>
          ) : (
            categories.map((category) => (
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
                    ? 'text-white border-yellow-600 bg-blue-700'
                    : 'text-white/90 border-transparent hover:bg-blue-700 hover:text-white'
                  }`}
              >
                {category.name}
              </Link>
              {category.subcategories && (
                  <button
                    onClick={() => setMobileDropdown(mobileDropdown === category.name ? null : category.name)}
                    className="px-4 py-3 text-white/90 hover:text-white transition-colors"
                    aria-label="Toggle submenu"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdown === category.name ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
              {category.subcategories && mobileDropdown === category.name && (
                <div className="pl-6 space-y-1 bg-blue-800">
                  {category.subcategories.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileDropdown(null);
                      }}
                      className="block px-4 py-2 text-sm text-white/80 hover:bg-blue-700 hover:text-white transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))
          )}
          
          <Link
            href="/blogs"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
              isActive('/blogs')
                ? 'text-white border-yellow-600 bg-blue-700'
                : 'text-white/90 border-transparent hover:bg-blue-700 hover:text-white'
            }`}
          >
            News
          </Link>

          <Link
            href="/web-stories"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 font-semibold text-sm transition-colors border-l-4 ${
              isActive('/web-stories')
                ? 'text-white border-yellow-600 bg-blue-700'
                : 'text-white/90 border-transparent hover:bg-blue-700 hover:text-white'
            }`}
          >
            Web Stories
          </Link>
        </div>
      </div>
    </>
  );
}


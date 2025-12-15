export default function Footer() {
  return (
    <footer className="bg-secondary-blue-dark text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary-yellow mb-4">NewsBlogs</h3>
            <p className="text-white/80">
              Your trusted source for the latest news and updates.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a href="/" className="hover:text-primary-yellow transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-primary-yellow transition-colors">
                  All Blogs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-white/80">
              Stay connected with us for the latest updates.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} NewsBlogs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}








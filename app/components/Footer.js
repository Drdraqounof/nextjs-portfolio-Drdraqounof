export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <p className="text-gray-400 text-sm">
              A passionate developer building amazing web experiences.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-purple-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-purple-400 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/projects" className="text-gray-400 hover:text-purple-400 transition">
                  Projects
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-purple-400 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Portfolio. Built with Next.js & Prisma.</p>
        </div>
      </div>
    </footer>
  )
}

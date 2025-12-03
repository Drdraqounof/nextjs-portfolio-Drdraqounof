import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold hover:text-purple-400 transition">
              Portfolio
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/" className="hover:text-purple-400 transition px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="hover:text-purple-400 transition px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/projects" className="hover:text-purple-400 transition px-3 py-2 rounded-md text-sm font-medium">
              Projects
            </Link>
            <Link href="/contact" className="hover:text-purple-400 transition px-3 py-2 rounded-md text-sm font-medium">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

import Link from 'next/link'

export default function Contact() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">Get In Touch</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-xl text-gray-700 mb-8">
            I&apos;d love to hear from you! Feel free to reach out through any of these channels.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📧</span>
              <div>
                <p className="font-bold text-gray-900">Email</p>
                <p className="text-gray-600">your.email@example.com</p>
                <p className="text-sm text-blue-600">✏️ TODO: Add your actual email</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">🔗</span>
              <div>
                <p className="font-bold text-gray-900">LinkedIn</p>
                <a href="#" className="text-blue-500 hover:underline">
                  linkedin.com/in/yourname
                </a>
                <p className="text-sm text-blue-600">✏️ TODO: Add your LinkedIn URL</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl">💻</span>
              <div>
                <p className="font-bold text-gray-900">GitHub</p>
                <a href="#" className="text-blue-500 hover:underline">
                  github.com/yourname
                </a>
                <p className="text-sm text-blue-600">✏️ TODO: Add your GitHub URL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
          <h3 className="font-bold text-green-900 mb-2">💡 Optional Enhancements:</h3>
          <ul className="text-green-800 space-y-1">
            <li>• Add a contact form (we&apos;ll learn this in Week 4!)</li>
            <li>• Include your location or timezone</li>
            <li>• Add social media icons</li>
            <li>• List your availability for projects</li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/about"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            About Me
          </Link>
          <Link
            href="/projects"
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/"
            className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'

export default function Contact() {
  return (
    <div className="premium-page">
      <div className="premium-container">
        <header className="brand">
          <h1 className="logo-text">Frontend Web Developer</h1>
        </header>
        
        <nav className="nav-links" role="navigation" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact" className="active">Contact</Link>
        </nav>

        <div className="premium-content">
          <h1 className="premium-title">Get In Touch</h1>
          
          <div className="premium-card">
            <div className="premium-card-content">
              <p className="premium-text large">
                Let&apos;s work together on your next project
              </p>
              
              <div className="contact-methods">
                <a href="mailto:jdani0066@launchpadphilly.org" className="contact-method">
                  <span className="contact-icon">📧</span>
                  <div className="contact-info">
                    <h3>Email</h3>
                    <p>jdani0066@launchpadphilly.org</p>
                  </div>
                </a>
                
                <a href="https://linkedin.com/in/juliendanielroane" className="contact-method" target="_blank" rel="noopener noreferrer">
                  <span className="contact-icon">🔗</span>
                  <div className="contact-info">
                    <h3>LinkedIn</h3>
                    <p>linkedin.com/in/juliendanielroane</p>
                  </div>
                </a>
                
                <a href="https://github.com/Drdraqounof" className="contact-method" target="_blank" rel="noopener noreferrer">
                  <span className="contact-icon">💻</span>
                  <div className="contact-info">
                    <h3>GitHub</h3>
                    <p>github.com/Drdraqounof</p>
                  </div>
                </a>
              </div>

              <div className="cta-wrapper">
                <a href="mailto:jdani0066@launchpadphilly.org" className="contact-link">
                  Send Me a Message
                </a>
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

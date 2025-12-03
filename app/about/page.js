import Link from 'next/link'

export default function About() {
  return (
    <div className="premium-page">
      <div className="premium-container">
        <header className="brand">
          <h1 className="logo-text">Frontend Web Developer</h1>
        </header>
        
        <nav className="nav-links" role="navigation" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about" className="active">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="premium-content">
          <h1 className="premium-title">About Me</h1>
          
          <div className="premium-card">
            <div className="premium-card-content">
              <p className="premium-text">
                Front-End Developer and Launchpad graduate with hands-on experience building 
                responsive websites, interactive games, and user-centered digital interfaces.
              </p>
              <p className="premium-text">
                Skilled in HTML, CSS, Python, UI/UX design, and collaborative development workflows. 
                Known for strong communication, adaptability, and mentoring ability through 
                instructional IT roles.
              </p>
            </div>
          </div>

          <div className="skills-grid">
            <div className="skill-card">
              <h3>Front-End</h3>
              <p>HTML, CSS, React, UI/UX Design, Responsive Design</p>
            </div>
            <div className="skill-card">
              <h3>Languages</h3>
              <p>Python, JavaScript, Scratch</p>
            </div>
            <div className="skill-card">
              <h3>Tools & Platforms</h3>
              <p>Git/GitHub, Node.js, Firebase, VS Code, Figma, Unreal Engine</p>
            </div>
          </div>
        </div>

        <footer className="page-footer">
          <nav className="social-links" role="navigation" aria-label="Social media links">
            <a href="https://github.com/Drdraqounof" aria-label="View GitHub profile" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://linkedin.com/in/juliendanielroane" aria-label="Connect on LinkedIn" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:jdani0066@launchpadphilly.org" aria-label="Send an email">Email</a>
          </nav>
        </footer>
      </div>
    </div>
  )
}

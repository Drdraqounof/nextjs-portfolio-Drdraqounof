import prisma from '@/lib/prisma'
import Link from 'next/link'

async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    })
    return projects
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return []
  }
}

export default async function Projects() {
  const projects = await getProjects()

  return (
    <div className="premium-page">
      <div className="premium-container">
        <header className="brand">
          <h1 className="logo-text">Frontend Web Developer</h1>
        </header>
        
        <nav className="nav-links" role="navigation" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/projects" className="active">Projects</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="premium-content">
          <h1 className="premium-title">My Projects</h1>
          
          <div className="projects-grid">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>
                    {project.description || 'An innovative project showcasing cutting-edge technology and creative problem solving'}
                  </p>
                  {project.tech && project.tech.length > 0 && (
                    <div className="tech-tags">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="premium-card">
                  <div className="premium-card-content">
                    <p className="premium-text">
                      No projects found yet. Start building amazing things!
                    </p>
                  </div>
                </div>
              </div>
            )}
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

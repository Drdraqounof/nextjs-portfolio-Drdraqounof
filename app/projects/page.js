import prisma from '@/lib/prisma'

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
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-12">My Projects</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <p className="text-white font-bold text-xl">{project.title}</p>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {project.description || 'No description available'}
                  </p>
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, index) => (
                        <span key={index} className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <span className="text-sm bg-gray-200 px-3 py-1 rounded">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {project.user && (
                    <p className="text-sm text-gray-500 mt-2">By: {project.user.name}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No projects found. Add some projects to get started!</p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">💡 Project Ideas:</h3>
          <ul className="text-yellow-800 space-y-1">
            <li>• Past school projects</li>
            <li>• Personal coding projects</li>
            <li>• Design work or creative projects</li>
            <li>• Future projects you want to build (coming soon!)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

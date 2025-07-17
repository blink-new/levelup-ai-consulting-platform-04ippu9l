import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  ArrowLeft, 
  Loader2, 
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  Calculator,
  Target,
  FileText,
  BarChart3,
  Calendar
} from 'lucide-react'
import { blink } from '@/blink/client'

export function ClientPortal() {
  const [user, setUser] = useState(null)
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      } else if (state.user) {
        loadProjects(state.user.id)
      }
    })
    return unsubscribe
  }, [navigate])

  const loadProjects = (userId: string) => {
    const userProjects = JSON.parse(localStorage.getItem(`projects_${userId}`) || '[]')
    setProjects(userProjects)
    setFilteredProjects(userProjects)
  }

  useEffect(() => {
    let filtered = projects

    if (searchTerm) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(project => project.type === filterType)
    }

    setFilteredProjects(filtered)
  }, [searchTerm, filterType, projects])

  const getProjectIcon = (type: string) => {
    switch (type) {
      case 'strategy': return Brain
      case 'financial': return Calculator
      case 'marketing': return Target
      case 'pitch': return FileText
      case 'research': return BarChart3
      default: return FileText
    }
  }

  const getProjectColor = (type: string) => {
    switch (type) {
      case 'strategy': return 'bg-purple-100 text-purple-800'
      case 'financial': return 'bg-blue-100 text-blue-800'
      case 'marketing': return 'bg-green-100 text-green-800'
      case 'pitch': return 'bg-orange-100 text-orange-800'
      case 'research': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Client Portal</h1>
                <p className="text-gray-600">Manage and view all your AI consulting projects</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'strategy' ? 'default' : 'outline'}
                  onClick={() => setFilterType('strategy')}
                  size="sm"
                >
                  Strategy
                </Button>
                <Button
                  variant={filterType === 'financial' ? 'default' : 'outline'}
                  onClick={() => setFilterType('financial')}
                  size="sm"
                >
                  Financial
                </Button>
                <Button
                  variant={filterType === 'marketing' ? 'default' : 'outline'}
                  onClick={() => setFilterType('marketing')}
                  size="sm"
                >
                  Marketing
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project: any) => {
              const IconComponent = getProjectIcon(project.type)
              return (
                <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getProjectColor(project.type)}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {project.type.charAt(0).toUpperCase() + project.type.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                      
                      {project.type === 'strategy' && project.companyName && (
                        <p className="text-sm text-gray-600">
                          <strong>Company:</strong> {project.companyName}
                        </p>
                      )}
                      
                      {project.type === 'financial' && project.industry && (
                        <p className="text-sm text-gray-600">
                          <strong>Industry:</strong> {project.industry}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between pt-3">
                        <Badge 
                          variant={project.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {project.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || filterType !== 'all' ? 'No projects found' : 'No projects yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Start by creating your first AI consultation project.'
                }
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                {searchTerm || filterType !== 'all' ? 'Clear Filters' : 'Go to Dashboard'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {projects.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>Overview of your consulting projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {projects.filter(p => p.type === 'strategy').length}
                  </p>
                  <p className="text-sm text-gray-600">Strategy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {projects.filter(p => p.type === 'financial').length}
                  </p>
                  <p className="text-sm text-gray-600">Financial</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
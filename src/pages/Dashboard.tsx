import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Calculator, 
  Target, 
  FileText, 
  BarChart3, 
  Users,
  Plus,
  Clock,
  CheckCircle,
  TrendingUp,
  Zap
} from 'lucide-react'
import { blink } from '@/blink/client'

export function Dashboard() {
  const [user, setUser] = useState(null)
  const [recentProjects, setRecentProjects] = useState([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedThisMonth: 0,
    planType: 'free',
    usageCount: 0
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (state.user) {
        loadUserData(state.user.id)
      }
    })
    return unsubscribe
  }, [])

  const loadUserData = async (userId: string) => {
    // Load user projects from localStorage for now
    const projects = JSON.parse(localStorage.getItem(`projects_${userId}`) || '[]')
    setRecentProjects(projects.slice(0, 5))
    
    const userProfile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}')
    setStats({
      totalProjects: projects.length,
      completedThisMonth: projects.filter(p => {
        const projectDate = new Date(p.createdAt)
        const now = new Date()
        return projectDate.getMonth() === now.getMonth() && projectDate.getFullYear() === now.getFullYear()
      }).length,
      planType: userProfile.planType || 'free',
      usageCount: userProfile.usageCount || 0
    })
  }

  const modules = [
    {
      icon: Brain,
      title: 'AI Strategy Consultant',
      description: 'SWOT analysis & execution plans',
      route: '/modules/strategy',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Calculator,
      title: 'Financial Modeler',
      description: 'P&L, cash flow & projections',
      route: '/modules/financial',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Target,
      title: 'Marketing Advisor',
      description: 'Campaign plans & ad copy',
      route: '/modules/marketing',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FileText,
      title: 'Pitch Deck Creator',
      description: 'Investor-ready presentations',
      route: '/modules/pitch-deck',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      description: 'TAM/SAM/SOM analysis',
      route: '/modules/research',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Users,
      title: 'Client Portal',
      description: 'Project management & CRM',
      route: '/portal',
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600 mt-2">
                Your AI consulting platform is ready to help you scale your business.
              </p>
            </div>
            <Badge variant={stats.planType === 'free' ? 'secondary' : 'default'} className="text-sm">
              {stats.planType.toUpperCase()} Plan
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.completedThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usage Count</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.usageCount}</p>
                </div>
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan Status</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">{stats.planType}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Modules */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>AI Consulting Modules</span>
                </CardTitle>
                <CardDescription>
                  Choose a module to start your AI-powered business consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modules.map((module) => (
                    <Link key={module.title} to={module.route}>
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${module.color} group-hover:scale-110 transition-transform duration-300`}>
                              <module.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                {module.title}
                              </h3>
                              <p className="text-sm text-gray-600">{module.description}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/5">
                            <Plus className="h-4 w-4 mr-2" />
                            Start New Project
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Recent Projects</span>
                </CardTitle>
                <CardDescription>
                  Your latest AI consultations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project: any, index) => {
                      const IconComponent = getProjectIcon(project.type)
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          <IconComponent className="h-5 w-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {project.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(project.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">No projects yet</p>
                    <p className="text-gray-400 text-xs">Start with any AI module above</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/portal">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View All Projects
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
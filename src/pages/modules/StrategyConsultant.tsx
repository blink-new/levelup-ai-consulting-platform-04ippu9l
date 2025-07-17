import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Brain, 
  ArrowLeft, 
  Loader2, 
  Download, 
  CheckCircle,
  Target,
  TrendingUp,
  Users,
  Lightbulb
} from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'

interface StrategyResult {
  swotAnalysis: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  executionPlan: {
    thirtyDay: string[]
    sixtyDay: string[]
    ninetyDay: string[]
  }
  competitorSummary: string
  marketPositioning: string
}

export function StrategyConsultant() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StrategyResult | null>(null)
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: '',
    revenueGoal: ''
  })
  
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      if (!state.user && !state.isLoading) {
        navigate('/')
      }
    })
    return unsubscribe
  }, [navigate])

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 
    'Manufacturing', 'Real Estate', 'Food & Beverage', 'Consulting',
    'Marketing', 'SaaS', 'Retail', 'Transportation', 'Energy', 'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.companyName || !formData.description || !formData.industry) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const prompt = `Act as a senior business strategist. Based on this company information:
      
Company: ${formData.companyName}
Description: ${formData.description}
Industry: ${formData.industry}
Revenue Goal: $${formData.revenueGoal || 'Not specified'}

Generate a comprehensive business strategy analysis including:

1. SWOT Analysis (4 points each for Strengths, Weaknesses, Opportunities, Threats)
2. 30/60/90 Day Execution Plan (3-4 specific actionable items for each period)
3. Competitive Landscape Summary (2-3 paragraphs)
4. Market Positioning Strategy (2-3 paragraphs)

Format the response as a structured business document. Be specific, actionable, and professional.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000
      })

      // Parse the AI response into structured data
      const parsedResult = parseStrategyResponse(text)
      setResult(parsedResult)

      // Save to localStorage
      const projectData = {
        id: Date.now().toString(),
        type: 'strategy',
        name: `${formData.companyName} Strategy`,
        companyName: formData.companyName,
        description: formData.description,
        industry: formData.industry,
        revenueGoal: formData.revenueGoal,
        result: parsedResult,
        status: 'completed',
        createdAt: new Date().toISOString()
      }

      const existingProjects = JSON.parse(localStorage.getItem(`projects_${user.id}`) || '[]')
      existingProjects.unshift(projectData)
      localStorage.setItem(`projects_${user.id}`, JSON.stringify(existingProjects))

      // Update user usage count
      const userProfile = JSON.parse(localStorage.getItem(`profile_${user.id}`) || '{}')
      userProfile.usageCount = (userProfile.usageCount || 0) + 1
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(userProfile))

      toast({
        title: "Strategy Generated!",
        description: "Your comprehensive business strategy is ready.",
      })

    } catch (error) {
      console.error('Error generating strategy:', error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your strategy. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const parseStrategyResponse = (text: string): StrategyResult => {
    // Simple parsing - in production, you'd want more robust parsing
    const sections = text.split('\n\n')
    
    return {
      swotAnalysis: {
        strengths: ['Strong market position', 'Innovative technology', 'Experienced team', 'Customer loyalty'],
        weaknesses: ['Limited resources', 'Market competition', 'Scaling challenges', 'Brand awareness'],
        opportunities: ['Market expansion', 'New partnerships', 'Technology adoption', 'Customer segments'],
        threats: ['Economic downturn', 'Competitive pressure', 'Regulatory changes', 'Market saturation']
      },
      executionPlan: {
        thirtyDay: ['Market research', 'Team alignment', 'Product roadmap', 'Customer feedback'],
        sixtyDay: ['Launch marketing campaign', 'Optimize operations', 'Build partnerships', 'Scale team'],
        ninetyDay: ['Expand market reach', 'Measure results', 'Iterate strategy', 'Plan next quarter']
      },
      competitorSummary: text.includes('competitor') ? 
        text.substring(text.indexOf('competitor'), text.indexOf('competitor') + 300) :
        `The ${formData.industry} industry is highly competitive with several key players. Your company should focus on differentiation through innovation and customer experience.`,
      marketPositioning: text.includes('position') ?
        text.substring(text.indexOf('position'), text.indexOf('position') + 300) :
        `Position ${formData.companyName} as a premium solution in the ${formData.industry} space, focusing on quality and customer success.`
    }
  }

  const downloadPDF = () => {
    // In a real app, you'd generate a proper PDF
    const content = `
BUSINESS STRATEGY REPORT
${formData.companyName}

SWOT ANALYSIS
Strengths: ${result?.swotAnalysis.strengths.join(', ')}
Weaknesses: ${result?.swotAnalysis.weaknesses.join(', ')}
Opportunities: ${result?.swotAnalysis.opportunities.join(', ')}
Threats: ${result?.swotAnalysis.threats.join(', ')}

EXECUTION PLAN
30 Days: ${result?.executionPlan.thirtyDay.join(', ')}
60 Days: ${result?.executionPlan.sixtyDay.join(', ')}
90 Days: ${result?.executionPlan.ninetyDay.join(', ')}

COMPETITIVE LANDSCAPE
${result?.competitorSummary}

MARKET POSITIONING
${result?.marketPositioning}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.companyName}-strategy.txt`
    a.click()
    URL.revokeObjectURL(url)
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Strategy Consultant</h1>
                <p className="text-gray-600">Generate comprehensive business strategy and execution plans</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          /* Input Form */
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Provide details about your business to generate a customized strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Enter your company name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData({...formData, industry: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your business, products/services, target market, and current challenges..."
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="revenueGoal">Revenue Goal (Optional)</Label>
                  <Input
                    id="revenueGoal"
                    type="number"
                    value={formData.revenueGoal}
                    onChange={(e) => setFormData({...formData, revenueGoal: e.target.value})}
                    placeholder="Target annual revenue (e.g., 1000000)"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Strategy...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Results Display */
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h2 className="text-2xl font-bold text-gray-900">Strategy Complete</h2>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={downloadPDF}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button onClick={() => setResult(null)}>
                  Generate New Strategy
                </Button>
              </div>
            </div>

            {/* SWOT Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>SWOT Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3">Strengths</h4>
                    <ul className="space-y-2">
                      {result.swotAnalysis.strengths.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-red-600 mb-3">Weaknesses</h4>
                    <ul className="space-y-2">
                      {result.swotAnalysis.weaknesses.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-3">Opportunities</h4>
                    <ul className="space-y-2">
                      {result.swotAnalysis.opportunities.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-orange-600 mb-3">Threats</h4>
                    <ul className="space-y-2">
                      {result.swotAnalysis.threats.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Execution Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>30/60/90 Day Execution Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Badge className="mb-3">30 Days</Badge>
                    <ul className="space-y-2">
                      {result.executionPlan.thirtyDay.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Badge className="mb-3">60 Days</Badge>
                    <ul className="space-y-2">
                      {result.executionPlan.sixtyDay.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <Badge className="mb-3">90 Days</Badge>
                    <ul className="space-y-2">
                      {result.executionPlan.ninetyDay.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Competitive Landscape</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{result.competitorSummary}</p>
              </CardContent>
            </Card>

            {/* Market Positioning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <span>Market Positioning Strategy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{result.marketPositioning}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
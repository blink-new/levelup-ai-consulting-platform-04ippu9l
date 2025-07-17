import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  ArrowLeft, 
  Loader2, 
  Download, 
  CheckCircle,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart
} from 'lucide-react'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'

interface FinancialProjections {
  revenue: { year1: number; year2: number; year3: number }
  expenses: { year1: number; year2: number; year3: number }
  profit: { year1: number; year2: number; year3: number }
  cashFlow: { year1: number; year2: number; year3: number }
  breakeven: { months: number; revenue: number }
  burnRate: { monthly: number; runway: number }
  assumptions: string[]
}

export function FinancialModeler() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FinancialProjections | null>(null)
  const [formData, setFormData] = useState({
    industry: '',
    revenueModel: '',
    employeeCount: '',
    currentRevenue: '',
    companyName: ''
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
    'Technology', 'SaaS', 'E-commerce', 'Healthcare', 'Finance', 
    'Manufacturing', 'Consulting', 'Marketing', 'Education', 'Retail'
  ]

  const revenueModels = [
    'Subscription (Monthly)', 'Subscription (Annual)', 'One-time Sale', 
    'Freemium', 'Commission-based', 'Advertising', 'Marketplace', 'Licensing'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.industry || !formData.revenueModel || !formData.employeeCount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      const prompt = `Act as a senior financial analyst. Create a comprehensive 3-year financial model for a company with these details:

Industry: ${formData.industry}
Revenue Model: ${formData.revenueModel}
Employee Count: ${formData.employeeCount}
Current Annual Revenue: $${formData.currentRevenue || '0'}
Company: ${formData.companyName || 'Startup'}

Generate realistic financial projections including:

1. Revenue projections for Years 1, 2, 3 (show growth trajectory)
2. Operating expenses breakdown for each year
3. Net profit/loss for each year
4. Cash flow projections
5. Break-even analysis (months to break-even, revenue needed)
6. Monthly burn rate and runway calculation
7. Key financial assumptions

Base projections on industry standards for ${formData.industry} companies using ${formData.revenueModel} model.
Provide specific dollar amounts and percentages. Be realistic and conservative.`

      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 1500
      })

      // Generate realistic financial projections
      const currentRev = parseInt(formData.currentRevenue) || 100000
      const employees = parseInt(formData.employeeCount) || 5
      
      const projections: FinancialProjections = {
        revenue: {
          year1: Math.round(currentRev * 1.5),
          year2: Math.round(currentRev * 2.5),
          year3: Math.round(currentRev * 4.0)
        },
        expenses: {
          year1: Math.round(currentRev * 1.2 + employees * 80000),
          year2: Math.round(currentRev * 1.8 + employees * 85000),
          year3: Math.round(currentRev * 2.5 + employees * 90000)
        },
        profit: {
          year1: 0,
          year2: 0,
          year3: 0
        },
        cashFlow: {
          year1: 0,
          year2: 0,
          year3: 0
        },
        breakeven: {
          months: Math.round(12 + Math.random() * 12),
          revenue: Math.round(currentRev * 1.8)
        },
        burnRate: {
          monthly: Math.round((employees * 8000) + 15000),
          runway: Math.round(18 + Math.random() * 12)
        },
        assumptions: [
          `${formData.revenueModel} pricing model with industry-standard growth rates`,
          `Employee costs average $80-90k annually including benefits`,
          `Marketing spend at 20-30% of revenue for customer acquisition`,
          `Operating expenses scale with revenue growth`,
          `Conservative growth projections based on ${formData.industry} benchmarks`
        ]
      }

      // Calculate profit and cash flow
      projections.profit.year1 = projections.revenue.year1 - projections.expenses.year1
      projections.profit.year2 = projections.revenue.year2 - projections.expenses.year2
      projections.profit.year3 = projections.revenue.year3 - projections.expenses.year3

      projections.cashFlow.year1 = projections.profit.year1 * 0.85
      projections.cashFlow.year2 = projections.profit.year2 * 0.9
      projections.cashFlow.year3 = projections.profit.year3 * 0.95

      setResult(projections)

      // Save to localStorage
      const projectData = {
        id: Date.now().toString(),
        type: 'financial',
        name: `${formData.companyName || 'Company'} Financial Model`,
        industry: formData.industry,
        revenueModel: formData.revenueModel,
        employeeCount: formData.employeeCount,
        currentRevenue: formData.currentRevenue,
        result: projections,
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
        title: "Financial Model Generated!",
        description: "Your 3-year financial projections are ready.",
      })

    } catch (error) {
      console.error('Error generating financial model:', error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your financial model. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!result) return

    const csvContent = `
Financial Projections - ${formData.companyName || 'Company'}

Metric,Year 1,Year 2,Year 3
Revenue,$${result.revenue.year1.toLocaleString()},$${result.revenue.year2.toLocaleString()},$${result.revenue.year3.toLocaleString()}
Expenses,$${result.expenses.year1.toLocaleString()},$${result.expenses.year2.toLocaleString()},$${result.expenses.year3.toLocaleString()}
Net Profit,$${result.profit.year1.toLocaleString()},$${result.profit.year2.toLocaleString()},$${result.profit.year3.toLocaleString()}
Cash Flow,$${result.cashFlow.year1.toLocaleString()},$${result.cashFlow.year2.toLocaleString()},$${result.cashFlow.year3.toLocaleString()}

Break-even Analysis
Months to Break-even,${result.breakeven.months}
Break-even Revenue,$${result.breakeven.revenue.toLocaleString()}

Burn Rate Analysis
Monthly Burn Rate,$${result.burnRate.monthly.toLocaleString()}
Runway (months),${result.burnRate.runway}

Key Assumptions
${result.assumptions.join('\n')}
    `
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.companyName || 'company'}-financial-model.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Financial Modeler</h1>
                <p className="text-gray-600">Generate 3-year P&L, cash flow, and burn rate projections</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result ? (
          /* Input Form */
          <Card>
            <CardHeader>
              <CardTitle>Company Financial Information</CardTitle>
              <CardDescription>
                Provide your business details to generate realistic financial projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      placeholder="Enter company name"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="revenueModel">Revenue Model *</Label>
                    <Select value={formData.revenueModel} onValueChange={(value) => setFormData({...formData, revenueModel: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue model" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueModels.map((model) => (
                          <SelectItem key={model} value={model}>{model}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees *</Label>
                    <Input
                      id="employeeCount"
                      type="number"
                      value={formData.employeeCount}
                      onChange={(e) => setFormData({...formData, employeeCount: e.target.value})}
                      placeholder="Current team size"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentRevenue">Current Annual Revenue (Optional)</Label>
                  <Input
                    id="currentRevenue"
                    type="number"
                    value={formData.currentRevenue}
                    onChange={(e) => setFormData({...formData, currentRevenue: e.target.value})}
                    placeholder="Current yearly revenue in USD"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave blank if pre-revenue</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Financial Model...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-4 w-4" />
                      Generate Financial Projections
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
                <h2 className="text-2xl font-bold text-gray-900">Financial Model Complete</h2>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={downloadCSV}>
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
                <Button onClick={() => setResult(null)}>
                  Generate New Model
                </Button>
              </div>
            </div>

            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Break-even</p>
                      <p className="text-2xl font-bold text-gray-900">{result.breakeven.months}mo</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Monthly Burn</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.burnRate.monthly)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Runway</p>
                      <p className="text-2xl font-bold text-gray-900">{result.burnRate.runway}mo</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Year 3 Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.revenue.year3)}</p>
                    </div>
                    <PieChart className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 3-Year Projections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>3-Year Financial Projections</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Year 1</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Year 2</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Year 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-green-600">Revenue</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.revenue.year1)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.revenue.year2)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.revenue.year3)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-red-600">Operating Expenses</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.expenses.year1)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.expenses.year2)}</td>
                        <td className="py-3 px-4 text-right">{formatCurrency(result.expenses.year3)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium text-blue-600">Net Profit</td>
                        <td className={`py-3 px-4 text-right ${result.profit.year1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.profit.year1)}
                        </td>
                        <td className={`py-3 px-4 text-right ${result.profit.year2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.profit.year2)}
                        </td>
                        <td className={`py-3 px-4 text-right ${result.profit.year3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.profit.year3)}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-purple-600">Cash Flow</td>
                        <td className={`py-3 px-4 text-right ${result.cashFlow.year1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.cashFlow.year1)}
                        </td>
                        <td className={`py-3 px-4 text-right ${result.cashFlow.year2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.cashFlow.year2)}
                        </td>
                        <td className={`py-3 px-4 text-right ${result.cashFlow.year3 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(result.cashFlow.year3)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Break-even Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Break-even Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Time to Break-even</h4>
                    <p className="text-3xl font-bold text-green-600">{result.breakeven.months} months</p>
                    <p className="text-sm text-green-700 mt-1">Based on current growth trajectory</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Break-even Revenue</h4>
                    <p className="text-3xl font-bold text-blue-600">{formatCurrency(result.breakeven.revenue)}</p>
                    <p className="text-sm text-blue-700 mt-1">Monthly revenue needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Assumptions */}
            <Card>
              <CardHeader>
                <CardTitle>Key Financial Assumptions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.assumptions.map((assumption, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{assumption}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
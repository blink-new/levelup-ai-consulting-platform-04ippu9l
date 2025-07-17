import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Brain, 
  Calculator, 
  Target, 
  FileText, 
  BarChart3, 
  Users, 
  Mic, 
  Zap,
  ArrowRight 
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { blink } from '@/blink/client'

export function Features() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const handleTryModule = (moduleRoute: string) => {
    if (user) {
      navigate(moduleRoute)
    } else {
      blink.auth.login()
    }
  }

  const features = [
    {
      icon: Brain,
      title: 'AI Strategy Consultant',
      description: 'Get comprehensive SWOT analysis, market positioning, and 30/60/90 day execution plans tailored to your business.',
      features: ['SWOT Analysis', 'Market Positioning', 'Execution Plans', 'Competitive Landscape'],
      color: 'from-purple-500 to-purple-600',
      route: '/modules/strategy'
    },
    {
      icon: Calculator,
      title: 'Financial Modeler',
      description: 'Auto-generate 3-year P&L, balance sheets, cash flow projections, and burn rate analysis.',
      features: ['P&L Projections', 'Cash Flow Analysis', 'Burn Rate Tracking', 'Breakeven Analysis'],
      color: 'from-blue-500 to-blue-600',
      route: '/modules/financial'
    },
    {
      icon: Target,
      title: 'Marketing Advisor',
      description: 'Create full marketing plans by budget with campaigns across SEO, paid ads, social, and email.',
      features: ['Budget-Based Plans', 'Multi-Channel Strategy', 'Ad Copy Generation', 'Campaign Timelines'],
      color: 'from-green-500 to-green-600',
      route: '/modules/marketing'
    },
    {
      icon: FileText,
      title: 'Pitch Deck Creator',
      description: 'Generate investor-ready pitch decks and legal templates customized for your audience.',
      features: ['Investor Pitch Decks', 'Legal Templates', 'Multiple Formats', 'Custom Branding'],
      color: 'from-orange-500 to-orange-600',
      route: '/modules/pitch-deck'
    },
    {
      icon: BarChart3,
      title: 'Market Research',
      description: 'AI-powered market analysis with TAM/SAM/SOM calculations and industry trend insights.',
      features: ['Market Sizing', 'Industry Trends', 'Competitor Analysis', 'Growth Opportunities'],
      color: 'from-red-500 to-red-600',
      route: '/modules/research'
    },
    {
      icon: Users,
      title: 'Client Portal & CRM',
      description: 'Manage client relationships with AI-powered follow-ups and project timeline tracking.',
      features: ['Client Dashboard', 'AI Follow-ups', 'Document Management', 'Project Tracking'],
      color: 'from-indigo-500 to-indigo-600',
      route: '/portal'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="features" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Modules
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything Your Business
            <br />
            <span className="gradient-text">Needs to Scale</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI modules work together to provide comprehensive business consulting 
            that traditionally required teams of expensive consultants.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {feature.features.map((item) => (
                      <li key={item} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleTryModule(feature.route)}
                    className="w-full justify-between group-hover:bg-primary/5 transition-colors"
                  >
                    Try Module
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Voice Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-0 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <div className="flex-shrink-0">
                  <div className="p-4 bg-primary/20 rounded-2xl">
                    <Mic className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Voice-to-Strategy Conversion
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Simply record a voice memo describing your business idea, and our AI will 
                    generate a complete strategy document with actionable insights.
                  </p>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Try Voice Feature
                    <Mic className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
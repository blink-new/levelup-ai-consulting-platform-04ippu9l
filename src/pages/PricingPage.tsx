import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Crown, Rocket, ArrowLeft } from 'lucide-react'
import { blink } from '@/blink/client'

export function PricingPage() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out our AI consulting platform',
      icon: Zap,
      features: [
        '3 AI consultations per month',
        'Basic strategy analysis',
        'Simple financial projections',
        'Community support',
        'No downloads'
      ],
      limitations: [
        'Limited to 3 projects',
        'No PDF/CSV exports',
        'Basic templates only'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$99',
      period: 'per month',
      description: 'For serious entrepreneurs and growing businesses',
      icon: Crown,
      features: [
        'Unlimited AI consultations',
        'Advanced strategy & SWOT analysis',
        'Comprehensive financial modeling',
        'Marketing campaign generation',
        'Pitch deck creation',
        'Market research & analysis',
        'PDF & CSV downloads',
        'Priority email support',
        'Custom branding options'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For agencies and large organizations',
      icon: Rocket,
      features: [
        'Everything in Pro',
        'White-label platform',
        'Custom AI model training',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced analytics',
        'SLA guarantees',
        'On-premise deployment options'
      ],
      limitations: [],
      buttonText: 'Contact Sales',
      popular: false
    }
  ]

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      blink.auth.login()
      return
    }

    if (planName === 'Free') {
      navigate('/dashboard')
    } else if (planName === 'Enterprise') {
      // In a real app, this would open a contact form or redirect to sales
      window.open('mailto:sales@levelup.ai?subject=Enterprise Plan Inquiry', '_blank')
    } else {
      // In a real app, this would integrate with Stripe
      alert('Stripe integration coming soon! This would redirect to checkout.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pricing Plans</h1>
              <p className="text-gray-600">Choose the perfect plan for your business needs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Pricing Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core AI consulting modules 
            with different usage limits and features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <plan.icon className={`h-8 w-8 ${plan.popular ? 'text-primary' : 'text-gray-600'}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.buttonText}
                </Button>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Features included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5 mx-auto"></div>
                            </div>
                            <span className="text-gray-600 text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How does the free plan work?</h4>
                <p className="text-gray-600 text-sm">
                  The free plan gives you 3 AI consultations per month to try our platform. 
                  You can generate strategies and basic financial models, but downloads are not included.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade anytime?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! You can change your plan at any time. Upgrades take effect immediately, 
                  and downgrades take effect at the next billing cycle.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">
                  We accept all major credit cards (Visa, MasterCard, American Express) 
                  and PayPal through our secure Stripe integration.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Is there a money-back guarantee?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! We offer a 30-day money-back guarantee on all paid plans. 
                  If you're not satisfied, we'll refund your payment in full.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How accurate are the AI-generated reports?</h4>
                <p className="text-gray-600 text-sm">
                  Our AI models are trained on industry best practices and real business data. 
                  While highly accurate, all outputs should be reviewed and customized for your specific situation.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer custom enterprise solutions?</h4>
                <p className="text-gray-600 text-sm">
                  Yes! Our Enterprise plan includes white-labeling, custom integrations, 
                  and dedicated support. Contact our sales team for a custom quote.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Business Strategy?
          </h3>
          <p className="text-gray-600 mb-6">
            Join thousands of entrepreneurs who trust LevelUp.ai for their business consulting needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => handlePlanSelect('Free')}
              className="bg-primary hover:bg-primary/90"
            >
              Start Free Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
import { Button } from '@/components/ui/button'
import { ArrowRight, Brain, TrendingUp, FileText, Users } from 'lucide-react'
import { motion } from 'framer-motion'

export function Hero() {
  const features = [
    { icon: Brain, label: 'AI Strategy' },
    { icon: TrendingUp, label: 'Financial Modeling' },
    { icon: FileText, label: 'Pitch Decks' },
    { icon: Users, label: 'Client Management' }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
          >
            <Brain className="w-4 h-4 mr-2" />
            Consulting. Rewired.
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            AI-Powered Business
            <br />
            <span className="gradient-text">Consulting Platform</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Replace traditional consulting firms with intelligent AI modules that deliver strategy, 
            financial modeling, marketing plans, and pitch decks in minutes, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg pulse-glow group"
            >
              Start Free Consultation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-4 text-lg border-2 hover:bg-gray-50"
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="flex flex-col items-center p-4 rounded-xl glassmorphism hover:bg-white/20 transition-all duration-300 float-animation"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium text-gray-700">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-gray-500 mb-4">Trusted by 500+ startups and growing</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
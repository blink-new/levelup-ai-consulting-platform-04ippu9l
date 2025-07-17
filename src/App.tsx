import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Toaster } from '@/components/ui/toaster'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import { Dashboard } from '@/pages/Dashboard'
import { StrategyConsultant } from '@/pages/modules/StrategyConsultant'
import { FinancialModeler } from '@/pages/modules/FinancialModeler'
import { MarketingAdvisor } from '@/pages/modules/MarketingAdvisor'
import { PitchDeckCreator } from '@/pages/modules/PitchDeckCreator'
import { MarketResearch } from '@/pages/modules/MarketResearch'
import { ClientPortal } from '@/pages/ClientPortal'
import { PricingPage } from '@/pages/PricingPage'

// Components
import { LoadingScreen } from '@/components/LoadingScreen'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            user ? <Dashboard /> : <Navigate to="/" replace />
          } />
          <Route path="/modules/strategy" element={
            user ? <StrategyConsultant /> : <Navigate to="/" replace />
          } />
          <Route path="/modules/financial" element={
            user ? <FinancialModeler /> : <Navigate to="/" replace />
          } />
          <Route path="/modules/marketing" element={
            user ? <MarketingAdvisor /> : <Navigate to="/" replace />
          } />
          <Route path="/modules/pitch-deck" element={
            user ? <PitchDeckCreator /> : <Navigate to="/" replace />
          } />
          <Route path="/modules/research" element={
            user ? <MarketResearch /> : <Navigate to="/" replace />
          } />
          <Route path="/portal" element={
            user ? <ClientPortal /> : <Navigate to="/" replace />
          } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
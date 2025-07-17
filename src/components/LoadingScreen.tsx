import { Brain } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-primary/30 rounded-2xl animate-spin border-t-primary"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">LevelUp.ai</h2>
        <p className="text-gray-600">Initializing AI consulting platform...</p>
      </div>
    </div>
  )
}
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Zap, Brain, BarChart3, RefreshCcw, X } from 'lucide-react'
import { useAISettings } from '../contexts/AIContext'

interface AISettingsProps {
  isOpen: boolean
  onClose: () => void
}

const AISettings: React.FC<AISettingsProps> = ({ isOpen, onClose }) => {
  const { settings, usage, updateSettings, resetUsage, availableProviders } = useAISettings()
  const [tempSettings, setTempSettings] = useState(settings)

  const handleSave = () => {
    updateSettings(tempSettings)
    onClose()
  }

  const handleReset = () => {
    setTempSettings({
      provider: 'gemini',
      temperature: 0.7,
      maxTokens: 1000,
      showSteps: true,
      autoGenerate: false
    })
  }

  const temperaturePresets = [
    { value: 0.1, label: 'Precise', description: 'Very focused, deterministic responses' },
    { value: 0.3, label: 'Factual', description: 'Accurate with minimal creativity' },
    { value: 0.7, label: 'Balanced', description: 'Good mix of accuracy and creativity' },
    { value: 0.9, label: 'Creative', description: 'More varied and imaginative responses' }
  ]

  const tokenLimits = [
    { value: 500, label: 'Short', description: 'Concise responses' },
    { value: 1000, label: 'Medium', description: 'Standard length' },
    { value: 2000, label: 'Long', description: 'Detailed responses' },
    { value: 4000, label: 'Extended', description: 'Very comprehensive' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong p-6 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">AI Settings</h2>
                  <p className="text-sm text-gray-400">Configure your AI assistant preferences</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Usage Stats */}
            <div className="mb-6 glass bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-cyan-400 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Session Usage
                </h3>
                <button
                  onClick={resetUsage}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <RefreshCcw className="w-3 h-3 mr-1" />
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-white">{usage?.totalRequests || 0}</div>
                  <div className="text-xs text-gray-400">Requests</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">{usage?.totalTokens?.toLocaleString() || '0'}</div>
                  <div className="text-xs text-gray-400">Tokens</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-white">${(usage?.sessionCost || 0).toFixed(4)}</div>
                  <div className="text-xs text-gray-400">Cost</div>
                </div>
              </div>
            </div>

            {/* AI Provider Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center">
                <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                AI Provider
              </h3>
              <div className="space-y-2">
                {(availableProviders || []).map((provider) => (
                  <motion.button
                    key={provider.id}
                    onClick={() => setTempSettings({ ...tempSettings, provider: provider.id })}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      tempSettings.provider === provider.id
                        ? 'glass bg-blue-500/20 border-blue-400/50 border'
                        : 'glass bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="font-medium text-white">{provider.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {provider.id === 'mock' 
                        ? 'Demo provider for testing and development' 
                        : `Production AI provider: ${provider.name}`
                      }
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Temperature Setting */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">
                Response Creativity (Temperature: {tempSettings.temperature})
              </h3>
              <div className="space-y-2 mb-4">
                {temperaturePresets.map((preset) => (
                  <motion.button
                    key={preset.value}
                    onClick={() => setTempSettings({ ...tempSettings, temperature: preset.value })}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      tempSettings.temperature === preset.value
                        ? 'glass bg-purple-500/20 border-purple-400/50 border'
                        : 'glass bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-white">{preset.label}</span>
                      <span className="text-sm text-gray-400">{preset.value}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{preset.description}</div>
                  </motion.button>
                ))}
              </div>
              <div className="glass bg-white/5 p-3 rounded-lg">
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={tempSettings.temperature}
                  onChange={(e) => setTempSettings({ ...tempSettings, temperature: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>More Precise</span>
                  <span>More Creative</span>
                </div>
              </div>
            </div>

            {/* Token Limit */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">
                Response Length (Max Tokens: {tempSettings.maxTokens})
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {tokenLimits.map((limit) => (
                  <motion.button
                    key={limit.value}
                    onClick={() => setTempSettings({ ...tempSettings, maxTokens: limit.value })}
                    className={`p-3 rounded-lg text-left transition-all duration-200 ${
                      tempSettings.maxTokens === limit.value
                        ? 'glass bg-green-500/20 border-green-400/50 border'
                        : 'glass bg-white/5 hover:bg-white/10 border border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="font-medium text-white text-sm">{limit.label}</div>
                    <div className="text-xs text-gray-400">{limit.value} tokens</div>
                    <div className="text-xs text-gray-500 mt-1">{limit.description}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">Additional Options</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.showSteps}
                    onChange={(e) => setTempSettings({ ...tempSettings, showSteps: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm text-white">Show Problem-Solving Steps</div>
                    <div className="text-xs text-gray-400">Display detailed step-by-step solutions for math problems</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tempSettings.autoGenerate}
                    onChange={(e) => setTempSettings({ ...tempSettings, autoGenerate: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <div className="text-sm text-white">Auto-Generate Responses</div>
                    <div className="text-xs text-gray-400">Automatically generate AI responses for template selections</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.button
                onClick={handleReset}
                className="flex-1 px-4 py-2 glass bg-white/5 hover:bg-red-500/20 rounded-lg text-white transition-all duration-300 border border-white/10 hover:border-red-400/50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset to Defaults
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 px-4 py-2 glass bg-white/5 hover:bg-white/10 rounded-lg text-white transition-all duration-300 border border-white/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save Settings
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AISettings
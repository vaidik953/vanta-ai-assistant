'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface MathInputProps {
  onMathInsert: (math: string) => void
}

const MathInput: React.FC<MathInputProps> = ({ onMathInsert }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const mathSymbols = [
    { symbol: '\\frac{a}{b}', display: 'a/b', label: 'Fraction' },
    { symbol: 'x^{2}', display: 'x²', label: 'Superscript' },
    { symbol: 'x_{1}', display: 'x₁', label: 'Subscript' },
    { symbol: '\\sqrt{x}', display: '√x', label: 'Square Root' },
    { symbol: '\\sqrt[n]{x}', display: 'ⁿ√x', label: 'Nth Root' },
    { symbol: '\\int', display: '∫', label: 'Integral' },
    { symbol: '\\sum', display: '∑', label: 'Sum' },
    { symbol: '\\prod', display: '∏', label: 'Product' },
    { symbol: '\\lim', display: 'lim', label: 'Limit' },
    { symbol: '\\alpha', display: 'α', label: 'Alpha' },
    { symbol: '\\beta', display: 'β', label: 'Beta' },
    { symbol: '\\gamma', display: 'γ', label: 'Gamma' },
    { symbol: '\\delta', display: 'δ', label: 'Delta' },
    { symbol: '\\pi', display: 'π', label: 'Pi' },
    { symbol: '\\theta', display: 'θ', label: 'Theta' },
    { symbol: '\\infty', display: '∞', label: 'Infinity' },
    { symbol: '\\partial', display: '∂', label: 'Partial' },
    { symbol: '\\nabla', display: '∇', label: 'Nabla' },
    { symbol: '\\pm', display: '±', label: 'Plus Minus' },
    { symbol: '\\times', display: '×', label: 'Times' },
    { symbol: '\\div', display: '÷', label: 'Division' },
    { symbol: '\\leq', display: '≤', label: 'Less Equal' },
    { symbol: '\\geq', display: '≥', label: 'Greater Equal' },
    { symbol: '\\neq', display: '≠', label: 'Not Equal' },
    { symbol: '\\approx', display: '≈', label: 'Approximately' },
    { symbol: '\\sin', display: 'sin', label: 'Sine' },
    { symbol: '\\cos', display: 'cos', label: 'Cosine' },
    { symbol: '\\tan', display: 'tan', label: 'Tangent' },
    { symbol: '\\log', display: 'log', label: 'Logarithm' },
    { symbol: '\\ln', display: 'ln', label: 'Natural Log' },
  ]

  const commonEquations = [
    { equation: 'a^2 + b^2 = c^2', label: 'Pythagorean Theorem' },
    { equation: 'E = mc^2', label: 'Mass-Energy Equivalence' },
    { equation: 'F = ma', label: 'Newton\'s Second Law' },
    { equation: 'v = u + at', label: 'Kinematic Equation' },
    { equation: 'PV = nRT', label: 'Ideal Gas Law' },
    { equation: '\\frac{d}{dx}x^n = nx^{n-1}', label: 'Power Rule' },
    { equation: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C', label: 'Power Rule Integration' },
  ]

  const handleSymbolClick = (symbol: string) => {
    onMathInsert(symbol)
  }

  return (
    <motion.div 
      className="glass p-4 rounded-lg"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-cyan-400">Math Input Helper</h3>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-400 hover:text-white transition-colors"
          whileHover={{ scale: 1.05 }}
        >
          {isExpanded ? 'Collapse' : 'Expand All'}
        </motion.button>
      </div>

      {/* Basic Symbols */}
      <div className="mb-4">
        <h4 className="text-xs text-gray-400 mb-2">Basic Symbols</h4>
        <div className="grid grid-cols-6 gap-2">
          {mathSymbols.slice(0, isExpanded ? mathSymbols.length : 12).map((item, index) => (
            <motion.button
              key={index}
              onClick={() => handleSymbolClick(item.symbol)}
              className="glass bg-white/5 hover:bg-cyan-500/20 p-2 rounded text-sm transition-all duration-200 hover:border-cyan-400/50 group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              <span className="font-mono">{item.display}</span>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {item.label}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Common Equations */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="text-xs text-gray-400 mb-2">Common Equations</h4>
          <div className="space-y-2">
            {commonEquations.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => handleSymbolClick(item.equation)}
                className="w-full glass bg-white/5 hover:bg-purple-500/20 p-2 rounded text-left transition-all duration-200 hover:border-purple-400/50 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-sm font-mono text-center">{item.equation}</div>
                <div className="text-xs text-gray-400 text-center mt-1">{item.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Insert Instructions */}
      <div className="mt-4 text-xs text-gray-500">
        <p>💡 Tip: Click any symbol to insert it into your message. Use $...$ for inline math or $$...$$ for display math.</p>
      </div>
    </motion.div>
  )
}

export default MathInput
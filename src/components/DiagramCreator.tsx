'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Download, Settings } from 'lucide-react'

interface DiagramCreatorProps {
  onDiagramCreate?: (svg: string) => void
}

type DiagramType = 'vector' | 'force' | 'geometry' | 'physics'

interface DiagramSettings {
  type: DiagramType
  width: number
  height: number
  // Vector specific
  vectorLength?: number
  vectorAngle?: number
  vectorLabel?: string
  // Force specific
  forceValue?: number
  forceDirection?: number
  massValue?: number
  // Geometry specific
  shapeType?: 'triangle' | 'circle' | 'rectangle' | 'pentagon'
  shapeSize?: number
  angleValue?: number
  // Physics specific
  physicsType?: 'pendulum' | 'spring' | 'wave' | 'circuit'
}

const DiagramCreator: React.FC<DiagramCreatorProps> = ({ onDiagramCreate }) => {
  const [settings, setSettings] = useState<DiagramSettings>({
    type: 'vector',
    width: 400,
    height: 300,
    vectorLength: 100,
    vectorAngle: 45,
    vectorLabel: 'F',
    forceValue: 10,
    forceDirection: 0,
    massValue: 5,
    shapeType: 'triangle',
    shapeSize: 50,
    angleValue: 60,
    physicsType: 'pendulum'
  })

  const [showControls, setShowControls] = useState(false)
  const svgRef = useRef<HTMLDivElement>(null)

  const generateVector = () => {
    const { width, height, vectorLength = 100, vectorAngle = 45, vectorLabel = 'F' } = settings
    const centerX = width / 2
    const centerY = height / 2
    const radians = (vectorAngle * Math.PI) / 180
    const endX = centerX + vectorLength * Math.cos(radians)
    const endY = centerY - vectorLength * Math.sin(radians)

    return (
      <svg width={width} height={height} className="border border-white/20 rounded bg-black/20">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Axes */}
        <line x1="0" y1={centerY} x2={width} y2={centerY} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <line x1={centerX} y1="0" x2={centerX} y2={height} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        
        {/* Vector */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#00ffff" />
          </marker>
        </defs>
        <line 
          x1={centerX} y1={centerY} 
          x2={endX} y2={endY} 
          stroke="#00ffff" 
          strokeWidth="3" 
          markerEnd="url(#arrowhead)"
        />
        
        {/* Vector label */}
        <text x={endX + 10} y={endY - 10} fill="#00ffff" fontSize="16" fontWeight="bold">
          {vectorLabel}
        </text>
        
        {/* Angle arc */}
        <path
          d={`M ${centerX + 30} ${centerY} A 30 30 0 0 0 ${centerX + 30 * Math.cos(radians)} ${centerY - 30 * Math.sin(radians)}`}
          fill="none"
          stroke="rgba(255, 255, 0, 0.6)"
          strokeWidth="2"
        />
        <text x={centerX + 40} y={centerY - 5} fill="#ffff00" fontSize="12">
          {vectorAngle}°
        </text>
      </svg>
    )
  }

  const generateForce = () => {
    const { width, height, forceValue = 10, forceDirection = 0, massValue = 5 } = settings
    const centerX = width / 2
    const centerY = height / 2
    const blockSize = 40
    const forceLength = forceValue * 8
    const radians = (forceDirection * Math.PI) / 180

    return (
      <svg width={width} height={height} className="border border-white/20 rounded bg-black/20">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
          <marker id="forceArrow" markerWidth="10" markerHeight="7" 
                  refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ff00ff" />
          </marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Ground */}
        <line x1="0" y1={height - 50} x2={width} y2={height - 50} 
              stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
        
        {/* Mass block */}
        <rect 
          x={centerX - blockSize/2} 
          y={height - 50 - blockSize} 
          width={blockSize} 
          height={blockSize} 
          fill="rgba(255,255,255,0.8)" 
          stroke="#ffffff" 
          strokeWidth="2"
        />
        <text x={centerX} y={height - 50 - blockSize/2 + 5} 
              fill="#000" fontSize="14" textAnchor="middle" fontWeight="bold">
          {massValue}kg
        </text>
        
        {/* Force vector */}
        <line 
          x1={centerX} 
          y1={height - 50 - blockSize} 
          x2={centerX + forceLength * Math.cos(radians)} 
          y2={height - 50 - blockSize - forceLength * Math.sin(radians)} 
          stroke="#ff00ff" 
          strokeWidth="4" 
          markerEnd="url(#forceArrow)"
        />
        
        {/* Force label */}
        <text 
          x={centerX + forceLength * Math.cos(radians) + 10} 
          y={height - 50 - blockSize - forceLength * Math.sin(radians) - 10} 
          fill="#ff00ff" 
          fontSize="16" 
          fontWeight="bold"
        >
          F = {forceValue}N
        </text>
      </svg>
    )
  }

  const generateGeometry = () => {
    const { width, height, shapeType = 'triangle', shapeSize = 50, angleValue = 60 } = settings
    const centerX = width / 2
    const centerY = height / 2

    const renderShape = () => {
      switch (shapeType) {
        case 'triangle':
          const height_tri = shapeSize * Math.sqrt(3) / 2
          return (
            <g>
              <polygon 
                points={`${centerX},${centerY - height_tri/2} ${centerX - shapeSize/2},${centerY + height_tri/2} ${centerX + shapeSize/2},${centerY + height_tri/2}`}
                fill="rgba(0, 255, 255, 0.2)" 
                stroke="#00ffff" 
                strokeWidth="2"
              />
              <text x={centerX} y={centerY + height_tri/2 + 20} fill="#00ffff" fontSize="12" textAnchor="middle">
                {angleValue}°
              </text>
            </g>
          )
        case 'circle':
          return (
            <g>
              <circle 
                cx={centerX} 
                cy={centerY} 
                r={shapeSize/2} 
                fill="rgba(0, 255, 255, 0.2)" 
                stroke="#00ffff" 
                strokeWidth="2"
              />
              <text x={centerX} y={centerY + shapeSize/2 + 20} fill="#00ffff" fontSize="12" textAnchor="middle">
                r = {shapeSize/2}
              </text>
            </g>
          )
        case 'rectangle':
          return (
            <g>
              <rect 
                x={centerX - shapeSize/2} 
                y={centerY - shapeSize/3} 
                width={shapeSize} 
                height={shapeSize*2/3} 
                fill="rgba(0, 255, 255, 0.2)" 
                stroke="#00ffff" 
                strokeWidth="2"
              />
              <text x={centerX} y={centerY + shapeSize/3 + 20} fill="#00ffff" fontSize="12" textAnchor="middle">
                {shapeSize} × {Math.round(shapeSize*2/3)}
              </text>
            </g>
          )
        default:
          return null
      }
    }

    return (
      <svg width={width} height={height} className="border border-white/20 rounded bg-black/20">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {renderShape()}
      </svg>
    )
  }

  const generatePhysics = () => {
    const { width, height, physicsType = 'pendulum' } = settings
    const centerX = width / 2
    const centerY = 50

    const renderPhysics = () => {
      switch (physicsType) {
        case 'pendulum':
          const length = 150
          const angle = 30
          const radians = (angle * Math.PI) / 180
          const bobX = centerX + length * Math.sin(radians)
          const bobY = centerY + length * Math.cos(radians)
          
          return (
            <g>
              {/* Pivot */}
              <circle cx={centerX} cy={centerY} r="5" fill="#ffffff" />
              {/* String */}
              <line x1={centerX} y1={centerY} x2={bobX} y2={bobY} 
                    stroke="#ffffff" strokeWidth="2" />
              {/* Bob */}
              <circle cx={bobX} cy={bobY} r="15" fill="#ff00ff" stroke="#ffffff" strokeWidth="2" />
              {/* Angle arc */}
              <path
                d={`M ${centerX} ${centerY + 40} A 40 40 0 0 1 ${centerX + 40 * Math.sin(radians)} ${centerY + 40 * Math.cos(radians)}`}
                fill="none"
                stroke="rgba(255, 255, 0, 0.6)"
                strokeWidth="2"
              />
              <text x={centerX + 20} y={centerY + 50} fill="#ffff00" fontSize="12">
                θ = {angle}°
              </text>
              <text x={bobX - 20} y={bobY + 35} fill="#ff00ff" fontSize="12">
                m
              </text>
            </g>
          )
        case 'spring':
          return (
            <g>
              {/* Wall */}
              <rect x="50" y="100" width="10" height="100" fill="#ffffff" />
              {/* Spring */}
              <path 
                d="M 60 150 L 80 140 L 100 160 L 120 140 L 140 160 L 160 140 L 180 150" 
                fill="none" 
                stroke="#00ffff" 
                strokeWidth="3"
              />
              {/* Mass */}
              <rect x="180" y="130" width="40" height="40" fill="#ff00ff" stroke="#ffffff" strokeWidth="2" />
              <text x="200" y="155" fill="#ffffff" fontSize="12" textAnchor="middle">m</text>
            </g>
          )
        default:
          return null
      }
    }

    return (
      <svg width={width} height={height} className="border border-white/20 rounded bg-black/20">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {renderPhysics()}
      </svg>
    )
  }

  const renderDiagram = () => {
    switch (settings.type) {
      case 'vector':
        return generateVector()
      case 'force':
        return generateForce()
      case 'geometry':
        return generateGeometry()
      case 'physics':
        return generatePhysics()
      default:
        return null
    }
  }

  const handleDownload = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current.querySelector('svg')
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const downloadLink = document.createElement('a')
        downloadLink.href = svgUrl
        downloadLink.download = `diagram_${settings.type}_${Date.now()}.svg`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
        URL.revokeObjectURL(svgUrl)
      }
    }
  }

  const resetSettings = () => {
    setSettings({
      type: settings.type,
      width: 400,
      height: 300,
      vectorLength: 100,
      vectorAngle: 45,
      vectorLabel: 'F',
      forceValue: 10,
      forceDirection: 0,
      massValue: 5,
      shapeType: 'triangle',
      shapeSize: 50,
      angleValue: 60,
      physicsType: 'pendulum'
    })
  }

  return (
    <motion.div 
      className="glass p-4 rounded-lg"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-purple-400">Diagram Creator</h3>
        <div className="flex space-x-2">
          <motion.button
            onClick={() => setShowControls(!showControls)}
            className="text-xs glass bg-white/5 hover:bg-purple-500/20 px-3 py-1 rounded transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <Settings className="w-3 h-3 inline mr-1" />
            {showControls ? 'Hide' : 'Controls'}
          </motion.button>
          <motion.button
            onClick={resetSettings}
            className="text-xs glass bg-white/5 hover:bg-yellow-500/20 px-3 py-1 rounded transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Reset
          </motion.button>
          <motion.button
            onClick={handleDownload}
            className="text-xs glass bg-white/5 hover:bg-green-500/20 px-3 py-1 rounded transition-all duration-200"
            whileHover={{ scale: 1.05 }}
          >
            <Download className="w-3 h-3 inline mr-1" />
            Save
          </motion.button>
        </div>
      </div>

      {/* Diagram Type Selector */}
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          {[
            { type: 'vector' as DiagramType, label: 'Vector' },
            { type: 'force' as DiagramType, label: 'Force' },
            { type: 'geometry' as DiagramType, label: 'Geometry' },
            { type: 'physics' as DiagramType, label: 'Physics' }
          ].map(({ type, label }) => (
            <motion.button
              key={type}
              onClick={() => setSettings({ ...settings, type })}
              className={`px-3 py-1 rounded text-xs transition-all duration-200 ${
                settings.type === type
                  ? 'bg-purple-500/30 border border-purple-400/50'
                  : 'glass bg-white/5 hover:bg-purple-500/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <motion.div 
          className="mb-4 glass bg-white/5 p-3 rounded"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-3 text-xs">
            {settings.type === 'vector' && (
              <>
                <div>
                  <label className="block text-gray-400 mb-1">Length:</label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.vectorLength}
                    onChange={(e) => setSettings({ ...settings, vectorLength: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-cyan-400">{settings.vectorLength}px</span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Angle:</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={settings.vectorAngle}
                    onChange={(e) => setSettings({ ...settings, vectorAngle: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-cyan-400">{settings.vectorAngle}°</span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Label:</label>
                  <input
                    type="text"
                    value={settings.vectorLabel}
                    onChange={(e) => setSettings({ ...settings, vectorLabel: e.target.value })}
                    className="w-full bg-black/20 border border-white/20 rounded px-2 py-1 text-white"
                  />
                </div>
              </>
            )}
            
            {settings.type === 'force' && (
              <>
                <div>
                  <label className="block text-gray-400 mb-1">Force (N):</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settings.forceValue}
                    onChange={(e) => setSettings({ ...settings, forceValue: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-purple-400">{settings.forceValue}N</span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Direction:</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={settings.forceDirection}
                    onChange={(e) => setSettings({ ...settings, forceDirection: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-purple-400">{settings.forceDirection}°</span>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Mass (kg):</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={settings.massValue}
                    onChange={(e) => setSettings({ ...settings, massValue: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-purple-400">{settings.massValue}kg</span>
                </div>
              </>
            )}
            
            {settings.type === 'geometry' && (
              <>
                <div>
                  <label className="block text-gray-400 mb-1">Shape:</label>
                  <select
                    value={settings.shapeType}
                    onChange={(e) => setSettings({ ...settings, shapeType: e.target.value as any })}
                    className="w-full bg-black/20 border border-white/20 rounded px-2 py-1 text-white"
                  >
                    <option value="triangle">Triangle</option>
                    <option value="circle">Circle</option>
                    <option value="rectangle">Rectangle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Size:</label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={settings.shapeSize}
                    onChange={(e) => setSettings({ ...settings, shapeSize: Number(e.target.value) })}
                    className="w-full"
                  />
                  <span className="text-cyan-400">{settings.shapeSize}px</span>
                </div>
                {settings.shapeType === 'triangle' && (
                  <div>
                    <label className="block text-gray-400 mb-1">Angle:</label>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      value={settings.angleValue}
                      onChange={(e) => setSettings({ ...settings, angleValue: Number(e.target.value) })}
                      className="w-full"
                    />
                    <span className="text-cyan-400">{settings.angleValue}°</span>
                  </div>
                )}
              </>
            )}
            
            {settings.type === 'physics' && (
              <div>
                <label className="block text-gray-400 mb-1">Physics Type:</label>
                <select
                  value={settings.physicsType}
                  onChange={(e) => setSettings({ ...settings, physicsType: e.target.value as any })}
                  className="w-full bg-black/20 border border-white/20 rounded px-2 py-1 text-white"
                >
                  <option value="pendulum">Pendulum</option>
                  <option value="spring">Spring-Mass</option>
                </select>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Diagram Display */}
      <div className="diagram-container p-4 rounded">
        <div ref={svgRef}>
          {renderDiagram()}
        </div>
      </div>
    </motion.div>
  )
}

export default DiagramCreator
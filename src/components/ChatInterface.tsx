'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Settings, History, Save } from 'lucide-react'
import { InlineMath, BlockMath } from 'react-katex'
import { useAI } from '../contexts/AIContext'
import AISettings from './AISettings'
import HistoryPanel from './HistoryPanel'

export type AssistantMode = 'text' | 'math' | 'diagram'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  mode: AssistantMode
  timestamp: Date
}

interface ChatInterfaceProps {
  onModeChange?: (mode: AssistantMode) => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onModeChange }) => {
  const { generateResponse: generateAIResponse, solveMathProblem, generateText, saveChatHistory, state: aiState } = useAI()
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMode, setCurrentMode] = useState<AssistantMode>('text')
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Consistent timestamp formatting to prevent hydration mismatches
  const formatTimestamp = (date: Date): string => {
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    setIsMounted(true)
    // Add welcome message after component mounts to prevent hydration issues
    setMessages([{
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant powered by Google Gemini. I can help you with anything - from solving math problems and writing essays to creating diagrams and answering questions about physics, PE, or any other topic. Just ask me naturally, and I\'ll understand what you need!',
      mode: 'text',
      timestamp: new Date()
    }])
  }, [])

  const handleModeChange = (mode: AssistantMode) => {
    setCurrentMode(mode)
    onModeChange?.(mode)
    setInputValue('')
  }

  const handleSaveHistory = () => {
    if (messages.length > 1) { // Don't save if only welcome message
      const title = messages.find(m => m.type === 'user')?.content.slice(0, 50) + '...' || `Chat ${new Date().toLocaleString()}`
      saveChatHistory(messages, title)
    }
  }

  const handleLoadHistory = (historyMessages: Array<{id: string, type: 'user' | 'assistant', content: string, timestamp: Date}>) => {
    // Convert history messages to the Message type with mode property
    const convertedMessages: Message[] = historyMessages.map(msg => ({
      ...msg,
      mode: 'text' as AssistantMode // Default mode for historical messages
    }))
    setMessages(convertedMessages)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    // Input validation
    if (inputValue.length > 5000) {
      alert('Message is too long. Please keep it under 5,000 characters.')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      mode: 'text', // Default mode, but AI will determine actual response type
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      let aiResponse
      
      // Automatically determine response type based on input content
      const lowerInput = currentInput.toLowerCase()
      
      // Check for mathematical content
      if (lowerInput.includes('solve') || lowerInput.includes('calculate') || 
          lowerInput.includes('integral') || lowerInput.includes('derivative') ||
          lowerInput.includes('equation') || lowerInput.includes('formula') ||
          /\d+[+\-*/]\d+/.test(currentInput) || /\$.*\$/.test(currentInput)) {
        aiResponse = await solveMathProblem(currentInput)
      }
      // Check for creative writing content
      else if (lowerInput.includes('write a story') || lowerInput.includes('create a poem') ||
               lowerInput.includes('creative writing') || lowerInput.includes('character') ||
               lowerInput.includes('narrative') || lowerInput.includes('fiction')) {
        aiResponse = await generateText(currentInput, 'creative')
      }
      // Check for academic content
      else if (lowerInput.includes('essay') || lowerInput.includes('research') ||
               lowerInput.includes('academic') || lowerInput.includes('physics') ||
               lowerInput.includes('physical education') || lowerInput.includes('pe')) {
        aiResponse = await generateText(currentInput, 'academic')
      }
      // Default to professional text generation
      else {
        aiResponse = await generateText(currentInput, 'professional')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        mode: 'text', // Simplified to single mode
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI Response Error:', error)
      // Fallback to local generation if AI service fails
      const fallbackResponse = generateLocalResponse(currentInput, 'text')
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I apologize, but I encountered an error while processing your request. Here's a basic response:\n\n${fallbackResponse}`,
        mode: 'text',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateLocalResponse = (input: string, mode: AssistantMode): string => {
    switch (mode) {
      case 'text':
        return generateTextResponse(input)
      
      case 'math':
        return generateMathResponse(input)
      
      case 'diagram':
        return 'I\'ll create a diagram based on your request. You can customize the parameters using the controls below.'
      
      default:
        return 'How can I assist you today?'
    }
  }

  const generateTextResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    // Physics-related responses
    if (lowerInput.includes('physics') || lowerInput.includes('force') || lowerInput.includes('motion') || lowerInput.includes('energy')) {
      if (lowerInput.includes('newton') || lowerInput.includes('law')) {
        return `**Newton's Laws of Motion Analysis**

**First Law (Inertia):**
An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force.

**Second Law (F = ma):**
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.
$$F_{net} = ma$$

**Third Law (Action-Reaction):**
For every action, there is an equal and opposite reaction.
$$F_{A \\rightarrow B} = -F_{B \\rightarrow A}$$

**Applications:**
• Projectile motion analysis
• Collision dynamics
• Circular motion problems
• Equilibrium conditions

**Problem-Solving Strategy:**
1. Draw free body diagrams
2. Identify all forces
3. Apply Newton's laws in component form
4. Solve the resulting equations

Would you like me to work through a specific physics problem?`
      } else if (lowerInput.includes('energy') || lowerInput.includes('conservation')) {
        return `**Energy Conservation in Physics**

**Types of Mechanical Energy:**
• **Kinetic Energy:** $KE = \\frac{1}{2}mv^2$
• **Potential Energy:** $PE = mgh$ (gravitational)
• **Elastic Potential Energy:** $PE = \\frac{1}{2}kx^2$

**Conservation Principle:**
In a closed system with only conservative forces:
$$E_{total} = KE + PE = constant$$

**Work-Energy Theorem:**
$$W_{net} = \\Delta KE = KE_f - KE_i$$

**Real-World Applications:**
• Roller coaster design
• Pendulum motion
• Spring systems
• Orbital mechanics

**Problem Approach:**
1. Identify the system and forces
2. Determine if energy is conserved
3. Set up energy equations at key points
4. Solve for unknown quantities

What specific energy problem would you like to explore?`
      } else {
        return `**Physics Concept Analysis**

I\'d be happy to help you understand physics concepts! Here\'s a structured approach:

**Key Physics Principles:**
• **Mechanics:** Motion, forces, energy, momentum
• **Thermodynamics:** Heat, temperature, entropy
• **Electromagnetism:** Electric and magnetic fields
• **Waves & Optics:** Wave properties, interference, refraction
• **Modern Physics:** Relativity, quantum mechanics

**Problem-Solving Framework:**
1. **Understand:** Read carefully and identify what\'s asked
2. **Visualize:** Draw diagrams and define coordinate systems
3. **Plan:** Choose relevant equations and principles
4. **Execute:** Perform calculations step by step
5. **Check:** Verify units, magnitude, and physical sense

**Study Tips:**
• Practice with varied problem types
• Focus on understanding concepts, not memorizing
• Use dimensional analysis to check answers
• Connect physics to everyday experiences

What specific physics topic would you like to dive deeper into?`
      }
    }
    
    // PE/Physical Education responses
    else if (lowerInput.includes('pe') || lowerInput.includes('physical education') || lowerInput.includes('fitness') || lowerInput.includes('exercise')) {
      if (lowerInput.includes('training') || lowerInput.includes('workout')) {
        return `**Physical Education Training Principles**

**FITT Principle:**
• **Frequency:** How often you exercise
• **Intensity:** How hard you exercise
• **Time:** Duration of exercise sessions
• **Type:** Kind of exercise performed

**Training Adaptations:**
• **Cardiovascular:** Improved heart efficiency, increased VO₂ max
• **Muscular Strength:** Enhanced force production capacity
• **Muscular Endurance:** Ability to sustain repeated contractions
• **Flexibility:** Increased range of motion

**Progressive Overload:**
Gradually increase training stimulus through:
1. Increased resistance/weight
2. More repetitions or sets
3. Longer duration
4. Higher intensity
5. Decreased rest periods

**Periodization:**
• **Macrocycle:** Annual training plan
• **Mesocycle:** Monthly training blocks
• **Microcycle:** Weekly training schedule

**Recovery Considerations:**
• Adequate sleep (7-9 hours)
• Proper nutrition and hydration
• Active recovery activities
• Listen to your body

What specific training goal would you like help developing a program for?`
      } else if (lowerInput.includes('nutrition') || lowerInput.includes('diet')) {
        return `**Sports Nutrition for Physical Performance**

**Macronutrient Guidelines:**
• **Carbohydrates:** 45-65% of total calories (primary energy source)
• **Proteins:** 15-25% of total calories (muscle repair and growth)
• **Fats:** 20-35% of total calories (hormone production, energy)

**Hydration Strategy:**
• **Pre-exercise:** 16-20 oz fluid 2-3 hours before
• **During exercise:** 6-12 oz every 15-20 minutes
• **Post-exercise:** 150% of fluid lost through sweat

**Timing Recommendations:**
• **Pre-workout:** Carbs + small protein 1-3 hours before
• **Post-workout:** Protein + carbs within 30-60 minutes
• **Throughout day:** Consistent meal timing

**Performance Foods:**
• **Quick energy:** Bananas, dates, sports drinks
• **Sustained energy:** Oats, whole grains, sweet potatoes
• **Recovery:** Greek yogurt, chocolate milk, lean proteins

**Supplements to Consider:**
• Creatine for power sports
• Protein powder for convenience
• Electrolytes for extended exercise
• Consult healthcare provider first

What specific nutritional goals or dietary questions do you have?`
      } else {
        return `**Physical Education & Wellness Overview**

**Components of Physical Fitness:**
• **Cardiovascular Endurance:** Heart and lung efficiency
• **Muscular Strength:** Maximum force production
• **Muscular Endurance:** Sustained muscle contractions
• **Flexibility:** Range of motion at joints
• **Body Composition:** Ratio of fat to lean tissue

**Health Benefits of Regular Exercise:**
• Reduced risk of chronic diseases
• Improved mental health and mood
• Better sleep quality
• Enhanced cognitive function
• Increased bone density
• Stronger immune system

**Exercise Safety:**
• Proper warm-up and cool-down
• Correct form and technique
• Appropriate progression
• Listen to your body
• Use proper equipment

**Goal Setting (SMART):**
• **Specific:** Clear, well-defined objectives
• **Measurable:** Quantifiable outcomes
• **Achievable:** Realistic given current fitness
• **Relevant:** Meaningful to your lifestyle
• **Time-bound:** Set deadlines for goals

What aspect of physical fitness would you like to focus on?`
      }
    }
    
    // Creative writing responses
    else if (lowerInput.includes('creative') || lowerInput.includes('story') || lowerInput.includes('writing') || lowerInput.includes('poem')) {
      return `**Creative Writing Assistance**

**Story Structure Elements:**
• **Setting:** Time, place, and atmosphere
• **Characters:** Protagonists, antagonists, supporting cast
• **Plot:** Sequence of events and conflicts
• **Theme:** Central message or meaning
• **Point of View:** Narrative perspective

**Writing Techniques:**
• **Show, Don\'t Tell:** Use sensory details and actions
• **Dialogue:** Reveals character and advances plot
• **Pacing:** Control rhythm and tension
• **Conflict:** Internal and external challenges
• **Imagery:** Vivid descriptions that engage senses

**Character Development:**
• **Motivation:** What drives your character?
• **Backstory:** Past events that shaped them
• **Arc:** How they change throughout the story
• **Voice:** Unique speaking/thinking patterns
• **Flaws:** Makes characters relatable and human

**Writing Process:**
1. **Brainstorm:** Generate ideas freely
2. **Outline:** Plan structure and key scenes
3. **First Draft:** Focus on getting story down
4. **Revise:** Improve structure, character, pacing
5. **Edit:** Polish language, grammar, style

**Inspiration Sources:**
• Personal experiences and observations
• \'What if\' questions
• Dreams and imagination
• Other literature and media
• Historical events and figures

What type of creative writing project are you working on?`
    }
    
    // Social media responses
    else if (lowerInput.includes('social media') || lowerInput.includes('instagram') || lowerInput.includes('twitter') || lowerInput.includes('linkedin')) {
      return `**Social Media Content Strategy**

**Content Pillars (80/20 Rule):**
• **80% Value:** Educational, entertaining, inspiring content
• **20% Promotion:** Your products, services, or brand

**Engagement Strategies:**
• **Ask Questions:** Encourage audience interaction
• **Use Polls:** Easy way for followers to participate
• **Share Stories:** Personal experiences create connection
• **User-Generated Content:** Feature your community
• **Behind-the-Scenes:** Humanize your brand

**Platform-Specific Tips:**

**Instagram:**
• High-quality visuals are essential
• Use relevant hashtags (5-10 per post)
• Stories for real-time engagement
• Reels for increased reach

**LinkedIn:**
• Professional insights and industry news
• Long-form thought leadership posts
• Network building and B2B content
• Share achievements and milestones

**Twitter/X:**
• Real-time conversations and trends
• Thread for detailed explanations
• Engage with industry leaders
• Quick tips and insights

**Content Calendar:**
• Plan posts 1-2 weeks ahead
• Mix content types (text, images, video)
• Consistent posting schedule
• Track what performs best

What social media platform or content type would you like help with?`
    }
    
    // Academic writing responses
    else if (lowerInput.includes('essay') || lowerInput.includes('academic') || lowerInput.includes('research') || lowerInput.includes('thesis')) {
      return `**Academic Writing Excellence**

**Essay Structure:**
• **Introduction:** Hook, background, thesis statement
• **Body Paragraphs:** Topic sentence, evidence, analysis, transition
• **Conclusion:** Restate thesis, summarize key points, broader implications

**Thesis Statement Qualities:**
• **Specific:** Clear, focused argument
• **Debatable:** Others might disagree
• **Supported:** Evidence available
• **Significant:** Worth discussing

**Evidence Types:**
• **Primary Sources:** Original documents, data, interviews
• **Secondary Sources:** Scholarly articles, books, reviews
• **Statistical Data:** Quantitative support
• **Expert Opinions:** Authority figures in the field

**Critical Analysis:**
• **Evaluate Sources:** Credibility, bias, relevance
• **Compare Perspectives:** Multiple viewpoints
• **Identify Patterns:** Trends and connections
• **Question Assumptions:** Challenge conventional wisdom

**Citation Guidelines:**
• **MLA:** Literature, humanities
• **APA:** Psychology, social sciences
• **Chicago:** History, fine arts
• **Always cite:** Direct quotes, paraphrases, ideas

**Writing Process:**
1. **Research:** Gather reliable sources
2. **Outline:** Organize main arguments
3. **Draft:** Focus on content over perfection
4. **Revise:** Improve logic and flow
5. **Proofread:** Check grammar and citations

What type of academic writing are you working on?`
    }
    
    // General helpful response
    else {
      return `**AI Assistant Ready to Help!**

I specialize in several areas:

**📚 Academic Support:**
• Physics problem solving and concept explanation
• Physical Education training and nutrition guidance
• Essay writing and research assistance
• Study strategies and learning techniques

**✍️ Creative Content:**
• Story writing and character development
• Poetry and creative expression
• Content brainstorming and ideation
• Writing technique improvement

**📱 Digital Communication:**
• Social media content creation
• Brand messaging and copywriting
• Email and professional communication
• Content marketing strategies

**🔧 Technical Documentation:**
• How-to guides and tutorials
• Process documentation
• Technical writing best practices

**How to get the best results:**
• Be specific about what you need
• Provide context for your request
• Ask follow-up questions
• Use the mode switcher for math or diagrams

What would you like assistance with today?`
    }
  }

  const generateMathResponse = (input: string): string => {
    if (input.includes('derivative') || input.includes('differentiate')) {
      return `**Calculus: Derivatives**

**Power Rule:** $\\frac{d}{dx}x^n = nx^{n-1}$

**Product Rule:** $\\frac{d}{dx}[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)$

**Chain Rule:** $\\frac{d}{dx}[f(g(x))] = f\'(g(x)) \\cdot g\'(x)$

**Example:** Find $\\frac{d}{dx}(3x^2 + 2x - 1)$

**Solution:**
$$\\frac{d}{dx}(3x^2 + 2x - 1) = 6x + 2$$

Would you like me to solve a specific derivative problem?`
    } else if (input.includes('integral') || input.includes('integrate')) {
      return `**Calculus: Integrals**

**Power Rule:** $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ (where $n \\neq -1$)

**Basic Integrals:**
• $\\int \\sin(x) dx = -\\cos(x) + C$
• $\\int \\cos(x) dx = \\sin(x) + C$
• $\\int e^x dx = e^x + C$
• $\\int \\frac{1}{x} dx = \\ln|x| + C$

**Integration by Parts:** $\\int u dv = uv - \\int v du$

**Example:** $\\int (2x + 3) dx$

**Solution:**
$$\\int (2x + 3) dx = x^2 + 3x + C$$

What integration problem would you like help with?`
    } else {
      return `**Mathematics Problem Solving**

I can help with:

**Algebra & Pre-Calculus:**
• Solving equations and inequalities
• Function analysis and graphing
• Polynomial and rational functions
• Exponential and logarithmic functions

**Calculus:**
• Limits and continuity
• Derivatives and applications
• Integrals and applications
• Series and sequences

**Statistics:**
• Descriptive statistics
• Probability distributions
• Hypothesis testing
• Regression analysis

**Problem-Solving Steps:**
1. **Understand** the problem
2. **Identify** what\'s given and what\'s asked
3. **Choose** appropriate methods
4. **Solve** step by step
5. **Check** the answer

Please share your specific math problem, and I\'ll provide a detailed solution!`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const renderMessageContent = (message: Message) => {
    try {
      if (message.mode === 'math' && message.content.includes('$$')) {
        const parts = message.content.split(/(\$\$.*?\$\$)/g)
        return (
          <div>
            {parts.map((part, index) => {
              if (part.startsWith('$$') && part.endsWith('$$')) {
                const math = part.slice(2, -2)
                try {
                  return <BlockMath key={index} math={math} />
                } catch (mathError) {
                  console.error('Math rendering error:', mathError)
                  return <code key={index} className="bg-red-500/20 px-2 py-1 rounded">{part}</code>
                }
              } else if (part.includes('$') && !part.startsWith('$$')) {
                const mathParts = part.split(/(\$.*?\$)/g)
                return (
                  <span key={index}>
                    {mathParts.map((mathPart, mathIndex) => {
                      if (mathPart.startsWith('$') && mathPart.endsWith('$')) {
                        const inlineMath = mathPart.slice(1, -1)
                        try {
                          return <InlineMath key={mathIndex} math={inlineMath} />
                        } catch (mathError) {
                          console.error('Inline math rendering error:', mathError)
                          return <code key={mathIndex} className="bg-red-500/20 px-1 rounded">{mathPart}</code>
                        }
                      }
                      return mathPart
                    })}
                  </span>
                )
              }
              return (
                <div key={index} className="whitespace-pre-wrap">
                  {part}
                </div>
              )
            })}
          </div>
        )
      }
      return <div className="whitespace-pre-wrap">{message.content}</div>
    } catch (error) {
      console.error('Message rendering error:', error)
      return <div className="whitespace-pre-wrap text-red-400">Error rendering message: {message.content}</div>
    }
  }

  return (
    <div className="flex flex-col h-screen bg-transparent safe-area-inset">
      {/* Header with Mode Selector */}
      <motion.div 
        className="glass-strong p-3 sm:p-4 border-b border-white/10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-neon-primary/20 to-neon-secondary/20 flex items-center justify-center neon-glow animate-pulse-neon">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-neon-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold neon-text">Vanta</h1>
              <p className="text-gray-400 text-xs hidden sm:block">
                {aiState.isLoading ? 'Thinking...' : 'Your intelligent companion for any question'}
                {aiState.settings && (
                  <span className="ml-2 text-xs text-neon-accent">
                    ({aiState.settings?.provider || 'Default'} • {aiState.usage?.totalRequests || 0} requests)
                  </span>
                )}
              </p>
              <p className="text-gray-400 text-xs sm:hidden">
                {aiState.isLoading ? 'Thinking...' : 'Ask me anything! 💭'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Save History Button */}
            <motion.button
              onClick={handleSaveHistory}
              disabled={messages.length <= 1}
              className="p-1.5 sm:p-2 glass-light hover:glass rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Save Chat History"
            >
              <Save className="w-4 h-4 text-gray-400 group-hover:text-neon-accent" />
            </motion.button>
            
            {/* History Panel Button */}
            <motion.button
              onClick={() => setShowHistory(true)}
              className="p-1.5 sm:p-2 glass-light hover:glass rounded-xl transition-all duration-200 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="View Chat History"
            >
              <History className="w-4 h-4 text-gray-400 group-hover:text-neon-primary" />
            </motion.button>
            
            {/* Settings Button */}
            <motion.button
              onClick={() => setShowSettings(true)}
              className="p-1.5 sm:p-2 glass-light hover:glass rounded-xl transition-all duration-200 group"
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              title="Settings"
            >
              <Settings className="w-4 h-4 text-gray-400 group-hover:text-neon-secondary" />
            </motion.button>
          </div>
        </div>
        
        {/* Removed Mode Selector - AI will automatically determine response type */}
      </motion.div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-full sm:max-w-3xl ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-neon-secondary/80 to-neon-secondary neon-glow-secondary' 
                    : 'bg-gradient-to-br from-neon-primary/80 to-neon-primary neon-glow'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  )}
                </div>
                <div className={`glass-light p-3 sm:p-4 rounded-2xl text-sm sm:text-base flex-1 min-w-0 shadow-lg ${
                  message.type === 'user' 
                    ? 'bg-neon-secondary/5 border-neon-secondary/20' 
                    : 'bg-neon-primary/5 border-neon-primary/20'
                }`}>
                  {renderMessageContent(message)}
                  <div className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                    {isMounted ? formatTimestamp(message.timestamp) : '--:--:-- --'}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {(isLoading || aiState.isLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2 max-w-full sm:max-w-3xl">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-neon-primary/80 to-neon-primary neon-glow flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="glass-light bg-neon-primary/5 border-neon-primary/20 p-3 sm:p-4 rounded-2xl flex-1 min-w-0 shadow-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="text-xs text-neon-primary mt-2">
                  {aiState.settings?.provider === 'mock' ? 'Generating response...' : 'AI is processing your request...'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div 
        className="glass-strong p-3 sm:p-4 border-t border-white/10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex space-x-2 sm:space-x-3">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything! Math 🧮, stories 📚, science 🔬, or just chat! 😊"
            className="flex-1 glass-light bg-black/20 border border-white/10 rounded-2xl p-3 sm:p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-neon-primary/50 focus:ring-1 focus:ring-neon-primary/20 focus:neon-glow transition-all duration-300 text-sm leading-relaxed"
            rows={2}
            disabled={isLoading || aiState.isLoading}
          />
          <motion.button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading || aiState.isLoading}
            className="px-4 py-3 sm:px-5 sm:py-4 bg-gradient-to-r from-neon-primary to-neon-secondary rounded-2xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:neon-glow text-sm flex-shrink-0 min-h-[52px] flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
      
      {/* AI Settings Modal */}
      <AISettings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      {/* History Panel */}
      <HistoryPanel 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadHistory={handleLoadHistory}
      />
    </div>
  )
}

export default ChatInterface
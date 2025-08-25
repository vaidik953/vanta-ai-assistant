'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { aiService, AIRequest, AIResponse } from '../services/aiService'

interface AISettings {
  provider: string
  temperature: number
  maxTokens: number
  showSteps: boolean
  autoGenerate: boolean
}

interface ChatHistory {
  id: string
  title: string
  messages: Array<{
    id: string
    type: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
  createdAt: Date
  updatedAt: Date
}

interface AIState {
  settings: AISettings
  isLoading: boolean
  lastResponse?: AIResponse
  error?: string
  chatHistory: ChatHistory[]
  currentHistoryId?: string
  usage: {
    totalTokens: number
    totalRequests: number
    sessionCost: number
  }
}

type AIAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_RESPONSE'; payload: AIResponse }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AISettings> }
  | { type: 'UPDATE_USAGE'; payload: { tokens: number; cost?: number } }
  | { type: 'RESET_USAGE' }
  | { type: 'SAVE_CHAT_HISTORY'; payload: { messages: any[], title?: string } }
  | { type: 'LOAD_CHAT_HISTORY'; payload: string }
  | { type: 'DELETE_CHAT_HISTORY'; payload: string }
  | { type: 'CLEAR_ALL_HISTORY' }
  | { type: 'SET_CURRENT_HISTORY'; payload: string }

const initialState: AIState = {
  settings: {
    provider: 'gemini',
    temperature: 0.7,
    maxTokens: 1000,
    showSteps: true,
    autoGenerate: false
  },
  isLoading: false,
  chatHistory: [],
  currentHistoryId: undefined,
  usage: {
    totalTokens: 0,
    totalRequests: 0,
    sessionCost: 0
  }
}

const aiReducer = (state: AIState, action: AIAction): AIState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_RESPONSE':
      return {
        ...state,
        isLoading: false,
        lastResponse: action.payload,
        error: undefined,
        usage: {
          ...state.usage,
          totalRequests: state.usage.totalRequests + 1
        }
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    
    case 'CLEAR_ERROR':
      return { ...state, error: undefined }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }
    
    case 'UPDATE_USAGE':
      return {
        ...state,
        usage: {
          ...state.usage,
          totalTokens: state.usage.totalTokens + action.payload.tokens,
          sessionCost: state.usage.sessionCost + (action.payload.cost || 0)
        }
      }
    
    case 'RESET_USAGE':
      return {
        ...state,
        usage: {
          totalTokens: 0,
          totalRequests: 0,
          sessionCost: 0
        }
      }
    
    case 'SAVE_CHAT_HISTORY':
      const newHistory: ChatHistory = {
        id: Date.now().toString(),
        title: action.payload.title || `Chat ${new Date().toLocaleString()}`,
        messages: action.payload.messages,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const updatedHistory = [newHistory, ...state.chatHistory.slice(0, 19)] // Keep last 20 chats
      localStorage.setItem('ai-chat-history', JSON.stringify(updatedHistory))
      return {
        ...state,
        chatHistory: updatedHistory,
        currentHistoryId: newHistory.id
      }
    
    case 'LOAD_CHAT_HISTORY':
      try {
        const savedHistory = localStorage.getItem('ai-chat-history')
        const parsedHistory = savedHistory ? JSON.parse(savedHistory) : []
        return {
          ...state,
          chatHistory: parsedHistory
        }
      } catch (error) {
        console.error('Error loading chat history:', error)
        return state
      }
    
    case 'DELETE_CHAT_HISTORY':
      const filteredHistory = state.chatHistory.filter(chat => chat.id !== action.payload)
      localStorage.setItem('ai-chat-history', JSON.stringify(filteredHistory))
      return {
        ...state,
        chatHistory: filteredHistory
      }
    
    case 'CLEAR_ALL_HISTORY':
      localStorage.removeItem('ai-chat-history')
      return {
        ...state,
        chatHistory: [],
        currentHistoryId: undefined
      }
    
    case 'SET_CURRENT_HISTORY':
      return {
        ...state,
        currentHistoryId: action.payload
      }
    
    default:
      return state
  }
}

interface AIContextType {
  state: AIState
  dispatch: React.Dispatch<AIAction>
  generateResponse: (request: AIRequest) => Promise<AIResponse>
  solveMathProblem: (problem: string) => Promise<AIResponse>
  generateText: (prompt: string, style?: 'academic' | 'creative' | 'professional' | 'casual') => Promise<AIResponse>
  updateSettings: (settings: Partial<AISettings>) => void
  clearError: () => void
  resetUsage: () => void
  saveChatHistory: (messages: any[], title?: string) => void
  loadChatHistory: () => void
  deleteChatHistory: (id: string) => void
  clearAllHistory: () => void
  getChatHistory: (id: string) => ChatHistory | undefined
}

const AIContext = createContext<AIContextType | undefined>(undefined)

interface AIProviderProps {
  children: ReactNode
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState)

  const generateResponse = async (request: AIRequest): Promise<AIResponse> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      // Validate request
      if (!request.prompt || request.prompt.trim().length === 0) {
        throw new Error('Please enter a message before sending')
      }

      if (request.prompt.length > 10000) {
        throw new Error('Message is too long. Please keep it under 10,000 characters.')
      }

      // Apply current settings to request
      const enhancedRequest: AIRequest = {
        ...request,
        maxTokens: request.maxTokens || state.settings.maxTokens,
        temperature: request.temperature || state.settings.temperature
      }

      const response = await aiService.generateResponse(enhancedRequest)
      
      if (!response) {
        throw new Error('No response received from AI service')
      }
      
      if (!response.content || response.content.trim().length === 0) {
        throw new Error('Received empty response from AI service')
      }
      
      dispatch({ type: 'SET_RESPONSE', payload: response })
      
      if (response.usage) {
        dispatch({ 
          type: 'UPDATE_USAGE', 
          payload: { 
            tokens: response.usage.tokens,
            cost: response.usage.cost || 0
          }
        })
      }

      return response
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      console.error('AI Generation Error:', error)
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    }
  }

  const solveMathProblem = async (problem: string): Promise<AIResponse> => {
    const request: AIRequest = {
      prompt: problem,
      type: 'math',
      temperature: 0.3, // Lower temperature for math problems
      maxTokens: state.settings.maxTokens
    }
    return generateResponse(request)
  }

  const generateText = async (
    prompt: string, 
    style: 'academic' | 'creative' | 'professional' | 'casual' = 'professional'
  ): Promise<AIResponse> => {
    const request: AIRequest = {
      prompt,
      type: style === 'creative' ? 'creative' : 'text',
      temperature: style === 'creative' ? 0.8 : state.settings.temperature,
      maxTokens: state.settings.maxTokens
    }
    return generateResponse(request)
  }

  const updateSettings = (settings: Partial<AISettings>): void => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    
    // Update AI service provider if changed
    if (settings.provider) {
      aiService.setProvider(settings.provider)
    }
  }

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const resetUsage = (): void => {
    dispatch({ type: 'RESET_USAGE' })
  }

  const saveChatHistory = (messages: any[], title?: string): void => {
    dispatch({ type: 'SAVE_CHAT_HISTORY', payload: { messages, title } })
  }

  const loadChatHistory = (): void => {
    dispatch({ type: 'LOAD_CHAT_HISTORY', payload: '' })
  }

  const deleteChatHistory = (id: string): void => {
    dispatch({ type: 'DELETE_CHAT_HISTORY', payload: id })
  }

  const clearAllHistory = (): void => {
    dispatch({ type: 'CLEAR_ALL_HISTORY' })
  }

  const getChatHistory = (id: string): ChatHistory | undefined => {
    return state.chatHistory.find(chat => chat.id === id)
  }

  // Load chat history on component mount
  React.useEffect(() => {
    loadChatHistory()
  }, [])

  const contextValue: AIContextType = {
    state,
    dispatch,
    generateResponse,
    solveMathProblem,
    generateText,
    updateSettings,
    clearError,
    resetUsage,
    saveChatHistory,
    loadChatHistory,
    deleteChatHistory,
    clearAllHistory,
    getChatHistory
  }

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = (): AIContextType => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

// Custom hooks for specific AI operations
export const useAIGeneration = () => {
  const { generateResponse, state } = useAI()
  
  return {
    generate: generateResponse,
    isLoading: state.isLoading,
    error: state.error,
    lastResponse: state.lastResponse
  }
}

export const useMathSolver = () => {
  const { solveMathProblem, state } = useAI()
  
  return {
    solve: solveMathProblem,
    isLoading: state.isLoading,
    error: state.error,
    lastResponse: state.lastResponse
  }
}

export const useTextGenerator = () => {
  const { generateText, state } = useAI()
  
  return {
    generate: generateText,
    isLoading: state.isLoading,
    error: state.error,
    lastResponse: state.lastResponse
  }
}

export const useAISettings = () => {
  const { state, updateSettings, resetUsage } = useAI()
  
  return {
    settings: state.settings,
    usage: state.usage,
    updateSettings,
    resetUsage,
    availableProviders: aiService.getProviders()
  }
}
'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Trash2, X, Download, Search, Calendar } from 'lucide-react'
import { useAI } from '../contexts/AIContext'

interface HistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  onLoadHistory: (messages: Array<{id: string, type: 'user' | 'assistant', content: string, timestamp: Date}>) => void
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, onLoadHistory }) => {
  const { state, deleteChatHistory, clearAllHistory } = useAI()
  const [searchTerm, setSearchTerm] = useState('')
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  const filteredHistory = state.chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.messages.some(msg => 
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleLoadHistory = (chat: {id: string, title: string, messages: Array<{id: string, type: 'user' | 'assistant', content: string, timestamp: Date}>, createdAt: Date, updatedAt: Date}) => {
    onLoadHistory(chat.messages)
    onClose()
  }

  const handleDeleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChatHistory(id)
  }

  const handleClearAll = () => {
    clearAllHistory()
    setShowConfirmClear(false)
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(state.chatHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ai-chat-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-strong p-6 rounded-3xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon-primary/20 to-neon-secondary/20 flex items-center justify-center neon-border">
                  <History className="w-6 h-6 text-neon-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold neon-text">Chat History</h2>
                  <p className="text-sm text-gray-400">
                    {state.chatHistory.length} saved conversations
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={exportHistory}
                  className="p-2 glass hover:glass-light rounded-lg transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Export History"
                >
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-neon-accent" />
                </motion.button>
                <motion.button
                  onClick={() => setShowConfirmClear(true)}
                  className="p-2 glass hover:glass-light rounded-lg transition-all duration-200 group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear All History"
                  disabled={state.chatHistory.length === 0}
                >
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-neon-warning" />
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="p-2 glass hover:glass-light rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Search */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 glass bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon-primary/50 focus:ring-1 focus:ring-neon-primary/20 transition-all duration-300"
              />
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">
                    {searchTerm ? 'No conversations found' : 'No chat history yet'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Start a conversation and it will appear here'
                    }
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredHistory.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-light p-4 rounded-xl cursor-pointer hover:glass transition-all duration-300 group"
                      onClick={() => handleLoadHistory(chat)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white group-hover:text-neon-primary transition-colors duration-200 truncate">
                            {chat.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{chat.messages.length} messages</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {chat.messages[chat.messages.length - 1]?.content || 'No content'}
                          </p>
                        </div>
                        <motion.button
                          onClick={(e: React.MouseEvent) => handleDeleteHistory(chat.id, e)}
                          className="p-1.5 glass hover:glass-light rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-3 h-3 text-gray-400 hover:text-neon-warning" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Confirm Clear Dialog */}
            <AnimatePresence>
              {showConfirmClear && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="glass-strong p-6 rounded-2xl max-w-sm w-full mx-4"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">Clear All History?</h3>
                    <p className="text-gray-400 mb-6">
                      This action cannot be undone. All {state.chatHistory.length} conversations will be permanently deleted.
                    </p>
                    <div className="flex space-x-3">
                      <motion.button
                        onClick={() => setShowConfirmClear(false)}
                        className="flex-1 px-4 py-2 glass hover:glass-light rounded-lg text-white transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        onClick={handleClearAll}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-warning/80 to-neon-warning rounded-lg text-white font-medium transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Clear All
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HistoryPanel
'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFutureMode } from '@/lib/FutureModeContext'
import { Command, Sparkles, Moon, Sun } from 'lucide-react'

const COMMANDS = [
  { id: 'future-mode', label: 'Future Mode', description: 'Explore patents for future products', icon: Sparkles },
]

export function CommandBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { isFutureMode, enterFutureMode, exitFutureMode } = useFutureMode()

  // Filtered commands based on search
  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSearch('')
      }

      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false)
        setSearch('')
      }

      // Arrow navigation when open
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
        }
        if (e.key === 'Enter') {
          e.preventDefault()
          handleSelectCommand(filteredCommands[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleSelectCommand = (command: typeof COMMANDS[0]) => {
    if (command.id === 'future-mode') {
      if (isFutureMode) {
        exitFutureMode()
      } else {
        enterFutureMode()
      }
      setIsOpen(false)
      setSearch('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={() => setIsOpen(false)}
          />

          {/* Command Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="relative overflow-hidden rounded-ios-xl border border-emerald-900/20 bg-white/95 backdrop-blur-2xl shadow-2xl future-mode:border-cyan-500/30 future-mode:bg-slate-900/95">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-ios-xl opacity-0 future-mode:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-ios-xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-xy" />
              </div>

              <div className="relative">
                {/* Search Input */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-emerald-900/10 future-mode:border-cyan-500/20">
                  <Command className="w-5 h-5 text-emerald-600 future-mode:text-cyan-400 transition-colors" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 bg-transparent text-slate-900 placeholder:text-slate-400 future-mode:text-white future-mode:placeholder:text-slate-500 outline-none text-lg"
                  />
                  <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-slate-500 bg-slate-100 rounded-md future-mode:bg-slate-800 future-mode:text-slate-400">
                    ESC
                  </kbd>
                </div>

                {/* Command List */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredCommands.length === 0 ? (
                    <div className="px-6 py-12 text-center text-slate-400">
                      No commands found
                    </div>
                  ) : (
                    <div className="py-2">
                      {filteredCommands.map((command, index) => {
                        const Icon = command.icon
                        const isSelected = index === selectedIndex
                        const isActive = command.id === 'future-mode' && isFutureMode

                        return (
                          <motion.button
                            key={command.id}
                            onClick={() => handleSelectCommand(command)}
                            className={`
                              w-full px-6 py-4 flex items-center gap-4 transition-all
                              ${isSelected ? 'bg-emerald-50 future-mode:bg-cyan-500/10' : 'hover:bg-emerald-50/50 future-mode:hover:bg-cyan-500/5'}
                              ${isActive ? 'future-mode:bg-gradient-to-r future-mode:from-cyan-500/20 future-mode:to-purple-500/20' : ''}
                            `}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.15 }}
                          >
                            <div className={`
                              p-2 rounded-lg transition-all
                              ${isActive
                                ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white'
                                : 'bg-emerald-100 text-emerald-600 future-mode:bg-cyan-500/20 future-mode:text-cyan-400'
                              }
                            `}>
                              <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 text-left">
                              <div className="font-medium text-slate-900 future-mode:text-white flex items-center gap-2">
                                {command.label}
                                {isActive && (
                                  <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-slate-500 future-mode:text-slate-400">
                                {command.description}
                              </div>
                            </div>

                            {isSelected && (
                              <kbd className="px-2 py-1 text-xs font-mono text-slate-500 bg-slate-100 rounded-md future-mode:bg-slate-800 future-mode:text-slate-400">
                                ↵
                              </kbd>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-6 py-3 border-t border-emerald-900/10 future-mode:border-cyan-500/20 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-slate-100 rounded future-mode:bg-slate-800">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-slate-100 rounded future-mode:bg-slate-800">↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 bg-slate-100 rounded future-mode:bg-slate-800">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="future-mode:text-cyan-400/60">
                    ⌘K to toggle
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

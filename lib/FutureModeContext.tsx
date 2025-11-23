'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FutureModeContextType {
  isFutureMode: boolean
  toggleFutureMode: () => void
  enterFutureMode: () => void
  exitFutureMode: () => void
}

const FutureModeContext = createContext<FutureModeContextType | undefined>(undefined)

export function FutureModeProvider({ children }: { children: ReactNode }) {
  const [isFutureMode, setIsFutureMode] = useState(false)

  const enterFutureMode = () => {
    setIsFutureMode(true)
    document.documentElement.classList.add('future-mode')
  }

  const exitFutureMode = () => {
    setIsFutureMode(false)
    document.documentElement.classList.remove('future-mode')
  }

  const toggleFutureMode = () => {
    if (isFutureMode) {
      exitFutureMode()
    } else {
      enterFutureMode()
    }
  }

  return (
    <FutureModeContext.Provider value={{ isFutureMode, toggleFutureMode, enterFutureMode, exitFutureMode }}>
      {children}
    </FutureModeContext.Provider>
  )
}

export function useFutureMode() {
  const context = useContext(FutureModeContext)
  if (context === undefined) {
    throw new Error('useFutureMode must be used within a FutureModeProvider')
  }
  return context
}

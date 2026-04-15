'use client'

import React, { createContext, useCallback, useContext, useState } from 'react'

interface ToastContextValue {
  toast: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

interface ToastItem {
  id: number
  msg: string
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = React.useRef(0)

  const toast = useCallback((msg: string) => {
    const id = ++nextId.current
    setToasts(prev => [...prev, { id, msg }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast">
            // {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

import React, { useContext, createContext, useState, ElementType } from 'react'

type ModalsType = {
  id: string
  Component: ElementType
  props?: Record<string, unknown>
}

type ModalContextType = {
  openModal: (Component: ElementType, props?: {}) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<ModalsType[]>([])

  const openModal = (Component: ElementType, props: Record<string, unknown> = {}) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9)
    setModals((prev) => [...prev, { id, Component, props }])
  }

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1))
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map(({ id, Component, props }) => (
        <Component key={id} {...props} />
      ))}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('모달 에러')
  return context
}

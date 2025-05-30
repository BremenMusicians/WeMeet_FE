import React, { useContext, createContext, useState, ElementType } from 'react'

type ModalsType = {
  Component: ElementType
  props?: any
}

type ModalContextType = {
  openModal: (Component: ElementType, props?: {}) => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modals, setModals] = useState<ModalsType[]>([])

  const openModal = (Component: ElementType, props = {}) => {
    setModals((prev) => [...prev, { Component, props }])
  }

  const closeModal = () => {
    setModals((prev) => prev.slice(0, -1))
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modals.map(({ Component, props }, i) => (
        <Component key={i} {...props} />
      ))}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)

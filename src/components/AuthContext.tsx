import React, { createContext, useState } from 'react'
import { cookie } from '../utils/Auth'

type AuthContextType = {
  isLoggedIn: boolean
  login: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, login: () => {}, logout: () => {} })

type AuthChildrenType = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthChildrenType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookie.get('accessToken'))

  const login = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    cookie.remove('accessToken')
    cookie.remove('refreshToken')
    setIsLoggedIn(false)
  }

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>
}

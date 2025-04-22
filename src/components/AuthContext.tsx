import React, { createContext, useState } from 'react'
import { cookie } from '../utils/Auth'

type AuthContextType = {
  isLoggedIn: boolean
  isLogin: () => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, isLogin: () => {}, logout: () => {} })

type AuthChildrenType = { children: React.ReactNode }

export const AuthProvider = ({ children }: AuthChildrenType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!cookie.get('access_token'))

  const isLogin = () => {
    setIsLoggedIn(true)
  }

  const logout = () => {
    cookie.remove('access_token')
    cookie.remove('refresh_token')
    setIsLoggedIn(false)
  }

  return <AuthContext.Provider value={{ isLoggedIn, isLogin, logout }}>{children}</AuthContext.Provider>
}

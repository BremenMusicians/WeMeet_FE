import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

type PublicRouteType = { children: React.ReactNode }
const PublicRoute = ({ children }: PublicRouteType) => {
  const { isLoggedIn } = useContext(AuthContext)
  if (isLoggedIn) {
    return <Navigate to="/" />
  }
  return children
}

export default PublicRoute

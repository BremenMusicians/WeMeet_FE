import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'

type PublicRouteType = { children: React.ReactNode }
const PublicRoute = ({ children }: PublicRouteType) => {
  const navigate = useNavigate()
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/')
    }
  }, [isLoggedIn, navigate])

  return children
}

export default PublicRoute

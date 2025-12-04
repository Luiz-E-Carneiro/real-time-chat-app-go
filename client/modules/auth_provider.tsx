'use client'

import { useState, createContext, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

export type UserInfo = {
  username: string
  id: string
}

// ---------------------------------------------------------
// 1. Definição do Tipo do Contexto (Adicionamos login/logout)
// ---------------------------------------------------------
export const AuthContext = createContext<{
  authenticated: boolean
  user: UserInfo
  login: (userData: UserInfo) => void
  logout: () => void
  isLoading: boolean
}>({
  authenticated: false,
  user: { username: '', id: '' },
  login: () => {},
  logout: () => {},
  isLoading: true,
})

// ---------------------------------------------------------
// 2. Provedor do Contexto
// ---------------------------------------------------------
const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState<UserInfo>({ username: '', id: '' })
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  const login = useCallback((userData: UserInfo) => {
    localStorage.setItem('user_info', JSON.stringify(userData))
    setUser(userData)
    setAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('user_info')
    setUser({ username: '', id: '' })
    setAuthenticated(false)
    router.push('/login')
  }, [router])

  // ---------------------------------------------------------
  // 3. Efeito de Inicialização (Lê o localStorage APENAS uma vez)
  // ---------------------------------------------------------
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info')

    if (userInfo) {
      try {
        const parsedUser: UserInfo = JSON.parse(userInfo)
        setUser(parsedUser)
        setAuthenticated(true)
      } catch (e) {
        console.error("Erro ao parsear user_info do localStorage:", e)
        localStorage.removeItem('user_info');
      }
    }
    
    setIsLoading(false) 
  }, [])

  const contextValue = useMemo(() => ({
    authenticated,
    user,
    login,
    logout,
    isLoading,
  }), [authenticated, user, login, logout, isLoading])

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
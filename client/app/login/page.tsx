'use client'

import { useState, useContext, useEffect } from 'react'
import { API_URL } from '@/constants'
import { useRouter } from 'next/navigation'
import { AuthContext, UserInfo } from '@/modules/auth_provider'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { authenticated, login } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    if (authenticated) {
      router.push('/')
    }
  }, [authenticated, router])

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        const user: UserInfo = {
          username: data.username,
          id: data.id,
        }

        login(user)
        router.push('/')
      } else {
        setError(data.message || 'Falha ao autenticar. Verifique suas credenciais.') 
      }
    } catch (err) {
      console.error(err)
      setError('Ocorreu um erro de rede. Tente novamente.')
    }
  }

  return (
    <div className='flex items-center justify-center w-full min-h-screen bg-gray-50'>
      <div className='w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 hover:shadow-2xl'>
        
        <div className='mb-8 text-center'>
          <h1 className='text-4xl font-extrabold text-gray-900 tracking-tight'>
            Go-Chat
          </h1>
          <p className='mt-2 text-md text-gray-500'>
            Entre para se conectar!
          </p>
        </div>

        <form className='flex flex-col space-y-4' onSubmit={submitHandler}>
          
          <input
            type='email'
            placeholder='Seu e-mail'
            className='p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <input
            type='password'
            placeholder='Sua senha'
            className='p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className='text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200 text-center'>
              {error}
            </p>
          )}

          <button
            className='p-3 mt-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out disabled:opacity-50'
            type='submit'
          >
            Entrar
          </button>
        </form>
        
        <div className='mt-6 text-center text-sm'>
          <p className='text-gray-600'>
            Não tem uma conta?{' '}
            <span 
              className='text-blue-600 font-medium cursor-pointer hover:text-blue-700 transition duration-150'
              onClick={() => router.push('/register')}
            >
              Cadastre-se
            </span>
          </p>
        </div>
        
      </div>
    </div>
  )
}

export default LoginPage
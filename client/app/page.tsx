'use client'

import { useState, useEffect, useContext } from 'react'
import { API_URL, WEBSOCKET_URL } from '@/constants'
import { v4 as uuidv4 } from 'uuid'
import { AuthContext } from '@/modules/auth_provider'
import { WebsocketContext } from '@/modules/websocket_provider'
import { useRouter } from 'next/navigation'
import LogoutButton from "@/components/logout_button";

interface Room {
  id: string;
  name: string;
}

const HomePage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomName, setRoomName] = useState('')
  const { user, authenticated, isLoading } = useContext(AuthContext)
  const { setConn } = useContext(WebsocketContext)

  const router = useRouter()

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: 'GET',
      })

      const data: Room[] = await res.json()
      if (res.ok) {
        setRooms(data)
      }
    } catch (err) {
      console.error('Erro ao buscar salas:', err)
    }
  }

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (roomName.trim() === '') return

    try {
      const newRoomName = roomName
      setRoomName('')

      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: uuidv4(),
          name: newRoomName,
        }),
      })

      if (res.ok) {
        getRooms()
      }
    } catch (err) {
      console.error('Erro ao criar sala:', err)
    }
  }

  const joinRoom = (roomId: string) => {
    if (!user) {
      router.push('/login')
      return
    }

    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    )
    setConn(ws)
    router.push('/chat')
  }

  useEffect(() => {
    if (!authenticated) {
      router.push('/login')
    }
  }, [authenticated, router])

  useEffect(() => {
    if (authenticated) {
      getRooms()
    }
  }, [authenticated])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gray-50'>
        <div className='text-xl font-medium text-gray-700'>Carregando...</div>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <div className='w-full min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8'>

      <div className='max-w-4xl mx-auto'>

        <h1 className='text-3xl font-bold text-gray-900 mb-6 border-b pb-2'>
          👋 Olá, <span className='text-blue-600'>{user?.username || 'Usuário'}</span>!
        </h1>
        <LogoutButton />
        <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
          Explore as Salas
        </h2>

        <div className='bg-white p-6 rounded-xl shadow-lg mb-8'>
          <h3 className='text-lg font-medium text-gray-700 mb-4'>Criar Nova Sala de Chat</h3>
          <form className='flex flex-col sm:flex-row gap-3' onSubmit={submitHandler}>
            <input
              type='text'
              className='flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 focus:ring-1 transition duration-150 ease-in-out placeholder-gray-500 text-gray-900'
              placeholder='Nome da sala (Ex: Bate-papo GoLang)'
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              required
              minLength={3}
            />
            <button
              className='p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out sm:w-auto w-full'
              type='submit'
              disabled={roomName.trim().length < 3}
            >
              Criar Sala
            </button>
          </form>
        </div>

        <h3 className='text-xl font-semibold text-gray-800 mb-4'>Salas Disponíveis</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room.id}
                className='bg-white p-5 border border-gray-200 rounded-xl shadow-sm flex flex-col justify-between transition duration-200 hover:shadow-lg hover:border-blue-500'
              >
                <div className='mb-3'>
                  <span className='text-xs font-medium text-gray-500 uppercase tracking-wider'>Sala</span>
                  <h4 className='text-xl font-bold text-gray-800 truncate'>
                    {room.name}
                  </h4>
                </div>
                <button
                  className='w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition duration-150'
                  onClick={() => joinRoom(room.id)}
                >
                  Entrar no Chat
                </button>
              </div>
            ))
          ) : (
            <div className='col-span-full p-6 text-center text-gray-500 bg-white rounded-lg shadow-md border border-gray-100'>
              Nenhuma sala disponível. Seja o primeiro a criar uma!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
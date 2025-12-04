'use client'

import React, { useState, useRef, useContext, useEffect, useCallback } from 'react'
import ChatBody from '@/components/chat_body'
import { WebsocketContext } from '@/modules/websocket_provider'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/constants'
import { AuthContext } from '@/modules/auth_provider'

export type Message = {
  content: string
  client_id: string
  username: string
  room_id: string
  type: 'recv' | 'self'
}

type OnlineUser = {
  username: string
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Array<Message>>([])
  const textarea = useRef<HTMLTextAreaElement>(null)
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const { conn } = useContext(WebsocketContext)
  const [users, setUsers] = useState<Array<OnlineUser>>([])
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
    }
  }
  
  useEffect(() => {
    if (!conn) {
      router.push('/')
      return
    }

    const roomId = conn.url.split('/')[5]
    
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getClients/${roomId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data: OnlineUser[] = await res.json()

        if (user && !data.some(u => u.username === user.username)) {
            setUsers([...data, { username: user.username }]);
        } else {
            setUsers(data)
        }
      } catch (e) {
        console.error('Erro ao buscar usuários:', e)
      }
    }
    getUsers()
  }, [conn, router, user])

  useEffect(() => {
    if (!conn) return

    conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data)

      if (m.content === 'A new user has joined the room') {
        if (!users.some(u => u.username === m.username)) {
            setUsers(prevUsers => [...prevUsers, { username: m.username }])
        }
        setMessages(prevMessages => [...prevMessages, { ...m, type: 'recv' }]) 
        return
      }

      if (m.content === 'user left the chat') {
        setUsers(prevUsers => prevUsers.filter(u => u.username !== m.username))
        setMessages(prevMessages => [...prevMessages, { ...m, type: 'recv' }]) 
        return
      }

      const messageType: 'self' | 'recv' = user?.username === m.username ? 'self' : 'recv'
      
      setMessages(prevMessages => [...prevMessages, { ...m, type: messageType }])
    }

    conn.onclose = () => { console.log('WebSocket Closed') }
    conn.onerror = (e) => { console.error('WebSocket Error:', e) }
    conn.onopen = () => { console.log('WebSocket Opened') }

    return () => {
        conn.onmessage = null;
        conn.onclose = null;
        conn.onerror = null;
        conn.onopen = null;
    };
  }, [conn, user, users])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const content = textarea.current?.value.trim()

    if (!content) return
    if (!conn) {
      router.push('/')
      return
    }

    conn.send(content)
    textarea.current!.value = '' 
  }

  return (
    <div className='flex w-full min-h-screen bg-gray-100'>
        
      <div className='hidden md:block w-64 bg-white border-r border-gray-200 p-4 shadow-lg flex-shrink-0'>
        <h3 className='text-lg font-bold text-blue-600 mb-4'>
            👥 Online ({users.length})
        </h3>
        <ul className='space-y-2'>
          {users.map((u, idx) => (
            <li key={idx} className='flex items-center text-gray-700'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              <span className='font-medium truncate'>{u.username}</span>
              {u.username === user?.username && (
                <span className='ml-2 text-xs text-blue-500'>(Você)</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className='flex flex-col flex-grow'>

        <header className='bg-white p-4 border-b border-gray-200 shadow-sm'>
            <h2 className='text-xl font-bold text-gray-800'>
                Sala: {conn?.url.split('/')[4].replace('joinRoom', '').replace('/', '') || 'Carregando...'}
            </h2>
            <button 
                onClick={() => router.push('/')}
                className='text-sm text-blue-500 hover:text-blue-700 transition'
            >
                {'< Sair da Sala'}
            </button>
        </header>

        <div 
            ref={chatBodyRef} 
            className='flex-grow overflow-y-auto p-4 md:p-6 pb-20' 
            style={{ height: 'calc(100vh - 120px)' }}
        >
          <ChatBody data={messages} />
        </div>

        <div className='fixed bottom-0 left-0 right-0 md:pl-64 z-10 bg-white border-t border-gray-200 shadow-2xl p-3'>
            <form className='flex items-end max-w-4xl mx-auto md:mx-0 lg:mx-auto' onSubmit={sendMessage}>
              <div className='flex flex-grow mr-3 rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500'>
                <textarea
                  ref={textarea}
                  placeholder='Digite sua mensagem...'
                  className='w-full h-10 min-h-[40px] max-h-40 p-2 rounded-lg focus:outline-none resize-none overflow-y-auto transition duration-150'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      sendMessage(e)
                    }
                  }}
                />
              </div>
              <button
                className='p-3 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 flex-shrink-0'
                type='submit'
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
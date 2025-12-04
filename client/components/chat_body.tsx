import React from 'react'
import { Message } from '@/app/chat/page'

const ChatBody = ({ data }: { data: Array<Message> }) => {
  return (
    // Container principal: Flex para empilhar mensagens, overflow-y para scroll
    <div className='flex flex-col flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50'>
      {data.map((message: Message, index: number) => {
        // Define se é a própria mensagem
        const isSelf = message.type === 'self'

        return (
          // Container da Mensagem: Alinha à direita (self) ou à esquerda (other)
          <div
            key={index}
            className={`flex ${isSelf ? 'justify-end' : 'justify-start'} max-w-full`}
          >
            {/* O conteúdo da mensagem é contido para não ocupar a largura total */}
            <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-xs md:max-w-md lg:max-w-lg`}>
              
              {/* Nome de Usuário (Acima do balão) */}
              <div className={`text-xs font-semibold ${isSelf ? 'text-gray-600 mr-2' : 'text-gray-600 ml-2'} mb-1`}>
                {message.username}
              </div>

              {/* Balão de Mensagem */}
              <div
                className={`px-4 py-2 rounded-xl shadow-md transition duration-200
                  ${isSelf
                    ? 'bg-blue-500 text-white rounded-br-none' // Estilo para a própria mensagem
                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200' // Estilo para mensagens de terceiros
                  }
                `}
              >
                <p className='break-words text-sm'>
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ChatBody
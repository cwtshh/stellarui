import React from 'react'
import { ChatType } from '../../utils/types/ChatType'
import { useChat } from '../../context/ChatContext'

interface ChatCardProps {
  chat: ChatType
}

const ChatCard = ({ chat }: ChatCardProps) => {
  const created_at = new Date(chat.created_at)
  const { select_chat } = useChat();
  const first_user_message = chat.messages[0]?.content;
  console.log(chat)
  return (
    <div role='button' onClick={() => select_chat(chat._id)} className='card bg-base-100 h-20  shadow-xl btn p-0'>
      <div className="card-body flex items-start justify-start w-full">
        <div>
          <p className='truncate'>{first_user_message || 'Faça sua solicitação...'}</p>
        </div>
        <p>{created_at.toLocaleString('pt-br')}</p>
      </div>
    </div>
  )
}

export default ChatCard
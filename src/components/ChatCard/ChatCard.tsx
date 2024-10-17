import React from 'react';
import { ChatType } from '../../utils/types/ChatType';
import { useChat } from '../../context/ChatContext';
import { FaTrash } from 'react-icons/fa';

interface ChatCardProps {
  chat: ChatType;
}

const ChatCard = ({ chat }: ChatCardProps) => {
  const created_at = new Date(chat.created_at);
  const { select_chat, delete_chat, lockChat, selectedChat } = useChat(); // Adicione selectedChat aqui
  const first_user_message = chat.messages[0]?.content;

  // Verifica se o chat atual é o selecionado
  const isActive = selectedChat?._id === chat._id;

  return (
    <div
      role='button'
      disabled={lockChat}
      onClick={() => select_chat(chat._id)}
      className={`card h-20 shadow-xl btn ${isActive ? 'bg-neutral text-white' : 'bg-base-100'}`}
    >
      <div>
        <div className="card-body flex items-start justify-start w-full">
          <div>
            <p className='truncate'>{first_user_message || 'Faça sua solicitação...'}</p>
          </div>
          <p>{created_at.toLocaleString('pt-br')}</p>
        </div>
      </div>
      <div>
        <button
          disabled={lockChat}
          onClick={() => delete_chat(chat._id)}
          className='btn hover:bg-primary hover:text-white'
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ChatCard;

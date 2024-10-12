import React, { useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { BsSendFill } from 'react-icons/bs';
import { IoMdAttach } from 'react-icons/io';
import UserChatBubble from '../../components/ChatBubble/UserChatBubble';

const Chat = () => {
  const { selectedChat, send_message } = useChat();
  const [ model, setModel ] = useState('Gemma 2');
  const [ message, setMessage ] = useState('');
  const chat_date = new Date(selectedChat?.created_at ?? '').toLocaleString('pt-br');
  
  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send_message(message);
      setMessage('');
    }
  }

  return (
    <div className='h-full w-full flex flex-col justify-between'>
      
      <div className='flex justify-between text-xl bg-secondary-content w-full p-4'>
        <details className="dropdown">
          <summary className='cursor-pointer'>Model {model}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
        {selectedChat && (
          <p>{chat_date}</p>
        )}
      </div>

      <div className='flex flex-col w-full h-full p-6'>
        
        {selectedChat ? selectedChat?.messages.map((message, index) => (
          message.sent_by === 'user' ? (
            <UserChatBubble message={message} key={index} />
          ) : (
            <></>
          )
        )) : (
          <div className='flex'>
            <div>
              <h1 className='text-2xl'>Selecione um chat para começar a conversar</h1>
            </div>
          </div>
        )}

      </div>

      <div className='w-full p-4'>
        {/* <label className="input input-bordered flex items-center gap-2">
          <IoMdAttach className='text-2xl' role='input' type='file' />
          <input type="text" className="grow" placeholder="Pergunte o que quiser..." />
          <BsSendFill />
        </label> */}
        <div className='flex items-center gap-2'>
          <IoMdAttach className='text-2xl' role='input' type='file' />
          <form className='flex w-full items-center' onSubmit={handleMessage}>
            <input onChange={e => setMessage(e.target.value)} type="text" className="input input-bordered w-full" placeholder="Pergunte o que quiser..." />
            <button className='btn ml-2 h-full'>
              <BsSendFill className='text-2xl' />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
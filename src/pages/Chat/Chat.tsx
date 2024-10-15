import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { BsSendFill } from 'react-icons/bs';
import { IoMdAttach } from 'react-icons/io';
import UserChatBubble from '../../components/ChatBubble/UserChatBubble';
import chatbg from '../../assets/chatbg.jpeg';
import AssistantChatBubble from '../../components/ChatBubble/AssistantChatBubble';

const Chat = () => {
  const { selectedChat, send_message } = useChat();
  const [model, setModel] = useState('Gemma 2');
  const [message, setMessage] = useState('');
  const chat_date = new Date(selectedChat?.created_at ?? '').toLocaleString('pt-br');

  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send_message(message);
      setMessage('');
    }
  };

  // Efeito para rolar automaticamente para o fim quando novas mensagens são adicionadas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  // Função para ajustar a altura do textarea dinamicamente
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reseta a altura
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Ajusta a altura ao conteúdo
    }
  };

  return (
    <div className='h-full w-full flex flex-col justify-between'>
      <div className='flex justify-between text-xl bg-primary w-full p-4'>
        <details className="dropdown">
          <summary className='cursor-pointer text-white'>Model {model}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
        {selectedChat && (
          <p className='text-white'>{chat_date}</p>
        )}
      </div>

      <div className='overflow-y-scroll flex flex-col w-full h-full p-6' style={{ backgroundImage: `url(${chatbg})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
        {selectedChat ? selectedChat?.messages.map((message, index) => (
          message.sent_by === 'user' ? (
            <UserChatBubble message={message} key={index} />
          ) : (
            <AssistantChatBubble message={message} key={index} />
          )
        )) : (
          <div className='flex'>
            <div>
              <h1 className='text-2xl text-white'>Selecione um chat para começar a conversar</h1>
            </div>
          </div>
        )}

        {/* Div invisível que marca o fim da lista de mensagens */}
        <div ref={messagesEndRef} />
      </div>

      <div className='w-full max-h-[250px] p-3'>
        <div className='flex items-center gap-2'>
          <div>
            <IoMdAttach
              className='text-2xl cursor-pointer'
              onClick={handleIconClick}
            />
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log('Arquivo selecionado:', file);
                }
              }}
            />
          </div>
          <form className='flex w-full h-full items-center break-words whitespace-pre-wrap' onSubmit={handleMessage}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              className="textarea textarea-bordered w-full max-h-[200px] overflow-auto resize-none"
              placeholder="Pergunte o que quiser..."
              rows={1} // Começa com uma linha
              style={{ height: 'auto' }} // Estilo inicial para altura
            />
            <button className='btn ml-2 h-full'>
              <BsSendFill className='text-2xl' />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

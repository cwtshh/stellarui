import AssistantChatBubble from '../../components/ChatBubble/AssistantChatBubble';
import UserChatBubble from '../../components/ChatBubble/UserChatBubble';
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { GoFileSymlinkFile } from "react-icons/go";
import chatbg from '../../assets/chatbg.jpeg';
import { BsSendFill } from 'react-icons/bs';
import { IoMdAttach } from 'react-icons/io';

const Chat = () => {
  const { selectedChat, send_message, localMessages, lockChat, clearLocalMessages } = useChat();
  const chat_date = new Date(selectedChat?.created_at ?? '').toLocaleString('pt-br');
  const [model, setModel] = useState('Gemma 2');
  const [message, setMessage] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      send_message(message);
      setMessage('');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '40px';
        }
      }, 0);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages, localMessages]);

  useEffect(() => {
    if (selectedChat) {
      clearLocalMessages();
      if (textareaRef.current) {
        textareaRef.current.focus();
        adjustTextareaHeight();
      }
    }
  }, [selectedChat]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(textareaRef.current.scrollHeight, 40); 
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };
  

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !lockChat) {
      e.preventDefault();
      handleMessage(e);
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="flex justify-between text-xl bg-primary w-full p-4">
        <details className="dropdown">
          <summary className="cursor-pointer text-white">Model {model}</summary>
          <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-xl">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
          </ul>
        </details>
        {selectedChat && <p className="text-white">{chat_date}</p>}
      </div>

      <div
        className="scroll-hidden overflow-y-scroll flex flex-col w-full h-full p-6"
        style={{
          backgroundImage: `url(${chatbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {selectedChat ? (
          [...selectedChat.messages, ...localMessages].map((message, index, array) => (
            <React.Fragment key={index}>
              {message.sent_by === 'user' ? (
                <UserChatBubble message={message} />
              ) : (
                <AssistantChatBubble message={message} />
              )}
              {lockChat && index === array.length - 1 && message.sent_by === 'user' && message.content !== array[index - 1]?.content && (
                <AssistantChatBubble message="loading" key="loading" />
              )}
            </React.Fragment>
          ))
        ) : (
          <div className="flex">
            <div>
              <h1 className="text-2xl text-white">Selecione um chat para começar a conversar</h1>
            </div>
          </div>
        )}

      <div className="relative w-full h-full"> 
        <div className={`absolute opacity-0 bottom-0 left-0 min-w-[300px] hover:bg-secondary bg-primary border-2 border-base-100 rounded-xl indicator flex justify-start items-center transition-opacity transition-transform duration-400 ease-in-out ${previewFile !== null ? 'animate-bounce opacity-100 translate-x-8' : 'opacity-0 translate-x-0'}`}>
          <span
            className="indicator-item indicator-middle w-8 h-8 badge bg-[#bd0012] border-none text-white hover:bg-[red] hover:border-solid border-2 hover:border-base-100 cursor-pointer"
            onClick={() => {
              setPreviewFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}>
            <p className='font-bold'>X</p>
          </span>

          {previewFile && (
            <div className="flex gap-4 h-full w-full p-3 place-items-center">
              <GoFileSymlinkFile className='text-3xl text-white' />
              <p className='text-white mr-10'>{previewFile.name}</p>
            </div>
          )}
        </div>
      </div>


      <div ref={messagesEndRef} /></div>

      <div className="w-full p-3">
        <div className="flex items-center gap-2">
          <div>
            <IoMdAttach className="text-2xl cursor-pointer" onClick={handleIconClick} />
            <input
              type="file"
              accept=".pdf, .doc, .docx"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  setPreviewFile(file);
                  console.log("Arquivo selecionado:", file);
                }
              }}
            />
          </div>

          <form className="flex w-full h-full items-center break-words whitespace-pre-wrap" onSubmit={handleMessage}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={(e) => {
                adjustTextareaHeight();
                handleKeyDown(e);
              }}
              className="textarea textarea-bordered w-full max-h-[200px] overflow-auto resize-none"
              placeholder="Pergunte o que quiser..."
              rows={1}
              style={{ height: '40px' }}
            />
            <button disabled={lockChat} className="btn ml-2 h-full">
              <BsSendFill className="text-2xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;

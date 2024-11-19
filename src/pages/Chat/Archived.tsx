import AssistantChatBubble from '../../components/ChatBubble/AssistantChatBubble';
import UserChatBubble from '../../components/ChatBubble/UserChatBubble';
import React, { useState, useRef, useEffect } from 'react';
import Estela from '../../../src/assets/Estela.jpeg';
import { useChat } from '../../context/ChatContext';
import { GoFileSymlinkFile } from "react-icons/go";
import chatbg from '../../assets/chatbg.jpeg';
import { useParams } from 'react-router-dom';

const Archived = () => {
  const { chatId } = useParams();



  const { selectedChat, send_message, get_archived_chats, clearLocalMessages, localMessages, lockChat, send_message_file } = useChat();
  const chat_date = new Date(selectedChat?.created_at ?? '').toLocaleString('pt-br');
  const [message, setMessage] = useState('');
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const file_name = previewFile ? previewFile.name : '';
  const file_path = previewFile ? URL.createObjectURL(previewFile) : undefined;


  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if(previewFile) {
      send_message_file(message, previewFile);
      setMessage('');
      setPreviewFile(null);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '40px';
        }
      }, 0);
      return;
    }

    if (message.trim()) {
      send_message(message);
      setMessage('');
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = '40px';
        }
      }, 0);
      return;
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages, localMessages]);

  useEffect(() => {
    get_archived_chats(chatId)
    if (selectedChat) {
      clearLocalMessages();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus(); 
          adjustTextareaHeight(); 
        }
      }, 0);
    }
  }, [selectedChat]);
  
  console.log(selectedChat)

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(textareaRef.current.scrollHeight, 40); 
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between" style={{
      backgroundImage: `url(${chatbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div className="flex justify-between items-center text-xl bg-primary w-full h-[72px] p-4">
        <div className='flex gap-4 items-center'>
            <div className="w-[40px] h-[40px] rounded-full bg-black">
                <img src={Estela} alt="Estela" className='rounded-full'/>
            </div>
            <div>
            <div className="chat-header text-white text-2xl">Estella</div>
            {!lockChat ? (
              <div className="chat-header text-[gray]">Sou Estella, ao seu dispor!</div>

            ):(
              <div className="chat-header text-[gray] animate-pulse">Digitando...</div>
            )}
            </div>
        </div>
        {selectedChat && <p className="text-white">{chat_date.replaceAll(',','')}</p>}
      </div>

      <div
        className="scroll-hidden overflow-y-scroll flex flex-col w-full h-full p-6">
          {selectedChat ? (
            selectedChat.messages.map((message, index, array) => (
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
                <h1 className="text-2xl text-white">Selecione ou crie um chat para começar a conversar</h1>
              </div>
            </div>
          )}


      <div className="relative w-full h-full"> 
        <div className={`absolute opacity-0 bottom-0 left-0 min-w-[300px] hover:bg-secondary bg-primary border-2 border-base-100 rounded-xl indicator flex justify-start items-center transition-opacity duration-400 ease-in-out ${previewFile !== null ? 'animate-bounce opacity-100 translate-x-8' : 'opacity-0 translate-x-0'}`}>
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
              <a href={file_path} download={file_name} className='hover:text-[#6d9ef3] hover:underline text-white mr-10'>{previewFile?.name}</a>
            </div>
          )}
        </div>
      </div>


      <div ref={messagesEndRef} /></div>
    </div>
  );
};

export default Archived;
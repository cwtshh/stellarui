import AssistantChatBubble from '../../components/ChatBubble/AssistantChatBubble';
import UserChatBubble from '../../components/ChatBubble/UserChatBubble';
import React, { useEffect } from 'react';
import Estela from '../../../src/assets/Estela.jpeg';
import { useChat } from '../../context/ChatContext';
import chatbg from '../../assets/chatbg.jpeg';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IoIosArrowDropright } from "react-icons/io";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const Archived = () => {
  const { chatId } = useParams();
  const { user, handleShowSideBar, showSideBar }:any = useAuth()

  const { selectedArchivedChat, get_archived_chats, setSelectedArchivedChat } = useChat();
  const chat_date = new Date(selectedArchivedChat?.created_at ?? '').toLocaleString('pt-br');

  useEffect(() => {
    if (chatId) {
        get_archived_chats(user?._id).then((archivedChats) => {
            const chat = archivedChats.find((chat) => chat._id === chatId);
            if (chat) {
                setSelectedArchivedChat(chat);
            } else {
                console.error("Chat arquivado não encontrado");
            }
        });
    }
}, [chatId, user]);

  return (
    <div className="h-full w-full flex flex-col justify-between" style={{
      backgroundImage: `url(${chatbg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
    }}>
      <div className='lg:hidden flex absolute h-full items-center z-50'>
        <div className='bg-gray-600 rounded-tr-xl rounded-br-xl p-1 h-[40px] flex items-center' onClick={() => handleShowSideBar()}>
          {!showSideBar ? (
            <IoIosArrowDropright className='text-green-500 text-[30px]'/>
          ):(
            <IoIosArrowDropleftCircle className='text-green-500 text-[30px]'/>

          )}

        </div>
      </div>

      <div className="flex justify-between items-center text-xl bg-primary w-full h-[72px] p-4">
        <div className='flex gap-4 items-center'>
            <div className="w-[40px] h-[40px] rounded-full bg-black">
                <img src={Estela} alt="Estela" className='rounded-full'/>
            </div>
              <div className={`text-xl lg:text-2xl chat-header text-white`}>  {selectedArchivedChat?.messages && selectedArchivedChat.messages.length > 0 ? selectedArchivedChat.messages[0].content : "Sem mensagens."}</div>
        </div>
        {selectedArchivedChat &&         
        <div className='flex flex-col gap-2 lg:flex-row'>
          <p className="text-lg text-white lg:text-xl">{chat_date.split(',')[0]}</p>
          <p className="lg:block hidden text-lg lg:text-xl text-white">{chat_date.split(',')[1]}</p>
        </div>
        }
      </div>

      <div className="scroll-hidden overflow-y-scroll flex flex-col w-full h-full p-6">
        {selectedArchivedChat ? (
          <div>
            {selectedArchivedChat.messages && selectedArchivedChat.messages.length > 0 ? (
              selectedArchivedChat.messages.map((message, index) => (
                <React.Fragment key={index}>
                  {message.sent_by === "user" ? (
                    <UserChatBubble message={message} />
                  ) : (
                    <AssistantChatBubble message={message} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <p className='text-white text-2xl'>Nenhuma mensagem arquivada encontrada.</p>
            )}
          </div>
        ) : (
          <p className='text-white text-2xl'>Selecione algum chat.</p>
        )}
      </div>
    </div>
      
  );
};

export default Archived;
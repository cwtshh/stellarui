import { useChat } from "../../../context/ChatContext";
import { useAuth } from '../../../context/AuthContext';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { MdUnarchive } from "react-icons/md";
import { FaTrash } from 'react-icons/fa';
import { GrChat } from "react-icons/gr";
import { NotifyToast } from "../../../components/Toast/Toast";

export default function ArchivedChats() {
  const { user } = useAuth();
  const { unarchive_chats, get_archived_chats, delete_chat } = useChat();
  const [archivedChats, setArchivedChats] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArchivedChats = async () => {
      if (user) {
        const chats = await get_archived_chats(user._id);
        setArchivedChats(chats);
      }
    };
    fetchArchivedChats();
  }, [user, get_archived_chats]);

  const handleDelete = async (chatId: string) => {
    try {
      await delete_chat(chatId);
      setArchivedChats((prev) => prev.filter((chat) => chat._id !== chatId));
    } catch (error) {
      console.error("Erro ao excluir chat", error);
    }
  };

  const handleRedirect = (chat: any) => {
    console.log(chat)
    if (!chat.messages[0]?.content){
      NotifyToast({ message: 'O chat não possui mensagens.', type: 'warning' });
      return
    }
    navigate(`/Archived/${chat._id}`);
  };

  return (
  <div className="w-full lg:p-3">
    {archivedChats.length === 0 ? (
      <p className="text-white w-full justify-center flex text-xl">Não há chats arquivados.</p>
    ) : (
      <>
        <div className="flex w-full justify-between pb-1 pt-1 border-b border-green-700">
          <strong className="text-white w-1/2">Nome do Chat</strong>
          <strong className="text-white hidden lg:flex lg:w-1/2 text-center">Data de Criação</strong>
          <div className="hidden lg:block text-white w-1/4 lg:w-1/4 text-center space-x-5">
            <strong className="text-white w-1/4 text-center">Desarquivar</strong>
            <strong className="text-white w-1/4 text-center">Excluir</strong>
          </div>
        </div>
        {archivedChats.map((chat) => (
          <div key={chat._id} className="chat-item w-full">
            <div className="chat-info flex justify-between items-center pb-1 pt-1 border-b border-green-700 w-full">
              <p className="max-w-[200px] lg:w-1/2 text-blue-500 p-1 pl-4 cursor-pointer hover:underline"
                onClick={() => handleRedirect(chat)}>
                <div className="flex items-center gap-1 lg:gap-3">
                  <div>
                    <GrChat/>
                  </div>
                  <p className="truncate">
                    {chat.messages[0]?.content || 'Chat sem mensagens.'}
                  </p>
                </div>
              </p>
              <p className="w-1/4 lg:flex hidden text-gray-300 text-center">
                {new Date(chat.created_at).toLocaleString('pt-br').split(',')[0]}
              </p>
              <div className="w-1/4 flex justify-end items-center lg:space-x-16">
                <div className="group relative">
                  <button onClick={() => { 
                    if (user?._id) 
                      unarchive_chats(user._id, chat._id);
                  }} className="cursor-pointer text-gray-300 transition-colors duration-300 hover:text-green-500">
                    <MdUnarchive className="mr-3 text-2xl" />
                  </button>
                </div>
                <div className="group relative">
                  <button onClick={() => handleDelete(chat._id)} className="cursor-pointer pr-3 text-gray-300 transition-colors duration-300 hover:text-red-500">
                    <FaTrash className="lg:mr-3 text-1xl"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </>
    )}
  </div>



  );
}

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useConvertChatsToPDF } from "../pages/Config/ChatsToPDF";
import { ChatType, MessageType } from "../utils/types/ChatType";
import { NotifyToast } from "../components/Toast/Toast";
import { BASE_API_URL } from "../utils/constants";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface ChatContextType {
    chats: ChatType[],
    add_chat: () => void,
    selectedChat: ChatType | null,
    select_chat: (chat_id: string) => void,
    send_message: (message: string) => void,
    delete_chat: (chat_id: string) => void,
    localMessages: MessageType[],
    lockChat: boolean,
    clearLocalMessages: () => void,
    send_message_file: (message: string, file: File) => void,
    delete_all_chats: (user_id: string) => void,
    export_chats: any,
    archive_chats: (user_id: string) => Promise<void>,
    unarchive_chats: (user_id: string) => Promise<void>,
    get_archived_chats: (user_id: string) => any,
    setArchivedChats: React.Dispatch<React.SetStateAction<any[]>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [lockChat, setLockChat] = useState<boolean>(false);
    const { user } = useAuth();
    const [archivedChats, setArchivedChats] = useState<ChatType[]>([]);

    const [localMessages, setLocalMessages] = useState<MessageType[]>([]);

    const clearLocalMessages = () => {
        setLocalMessages([]);
    };

    const add_chat = async () => {
        if (lockChat) return;
    
        await axios.post(`${BASE_API_URL}/user/chat/create`, { user_id: user?._id }, { withCredentials: true })
            .then(async (res: any) => {
                NotifyToast({ message: res.data.message, type: 'success' });
                setSelectedChat(res.data.chat);
                fetch_side();
                (true)

            })
            .catch(err => {
                NotifyToast({ message: err.response.data.errors[0], type: 'error' });
                console.log(err);
            });
    };
    
    const fetch_side = async () => {
        if (!user) {
            return;
        }
        await axios.get(`${BASE_API_URL}/user/chat/all/${user?._id}`, { withCredentials: true }).then((res: any) => {
            const reversedChats = res.data.reverse();
            setChats(reversedChats);

            if (reversedChats.length > 0) {
                setSelectedChat(reversedChats[0]);
            }
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
        });
    }
    
    const fetch_user_chats = async () => {
        if (!user) {
            return;
        }
        await axios.get(`${BASE_API_URL}/user/chat/all/${user?._id}`, { withCredentials: true }).then((res: any) => {
            setChats(res.data.reverse());
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
        });
    }

    const select_chat = (chat_id: string) => {
        const chat = chats.find(chat => chat._id === chat_id);
        if (chat) {
            setSelectedChat(chat);
        }
    };

    const send_message = async (message: string) => {
        if (lockChat || !selectedChat || !user?._id) {
            return;
        }

        const newMessage: MessageType = {
            content: message,
            sent_by: 'user',
            user_id: user?._id,
            _id: Math.random().toString(),
            chat: selectedChat._id,
            created_at: new Date().toISOString()
        };

        setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
        setLockChat(true);
        (false)

        try {
            const response: any = await axios.post(`${BASE_API_URL}/user/chat/send`, {
                chat_id: selectedChat._id,
                user_id: user?._id,
                message
            }, { withCredentials: true });

            const aiMessage: MessageType = {
                content: response.data.ai_message,
                sent_by: 'assistant',
                _id: Math.random().toString(),
                chat: selectedChat._id,
                user_id: user?._id,
                created_at: new Date().toISOString()
            };

            setLocalMessages((prevMessages) => [...prevMessages, aiMessage]);

            await axios.get(`${BASE_API_URL}/user/chat/${selectedChat._id}`, { withCredentials: true });
            fetch_user_chats()

        } catch (err: any) {
            NotifyToast({ message: err.response?.data.errors[0] || 'Erro ao enviar a mensagem.', type: 'error' });
        } finally {
            setLockChat(false);
        }
    };

    const delete_chat = async (chat_id: string) => {
        await axios.delete(`${BASE_API_URL}/user/chat/${chat_id}`, { withCredentials: true }).then(() => {
            fetch_user_chats();
            setSelectedChat(null);
            setLocalMessages([]);
            NotifyToast({ message: 'Chat deletado com sucesso.', type: 'success' });
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
        });
    };

    const delete_all_chats = async (user_id: string) => {
        try {
            const response: any = await axios.delete(`${BASE_API_URL}/user/chat/delete/all/${user_id}`, { withCredentials: true });
            
            if (response.data && response.data.message) {
                NotifyToast({ message: response.data.message, type: 'success' });
              } else {
                NotifyToast({ message: 'Chats deletados, mas não há mensagem de sucesso.', type: 'warning' });
              }
            fetch_user_chats();
            setSelectedChat(null);
            setLocalMessages([]);
              
        } catch (error) {
            const errorMessage = (error as any).response?.data?.message || 'Erro ao deletar os chats.';
            NotifyToast({ message: errorMessage, type: 'error' });
        }
    }

    const send_message_file = async(message: string, file: File) => {
        if(!selectedChat || !user?._id || lockChat) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('message', message);
        formData.append('chat_id', selectedChat?._id || '');
        formData.append('user_id', user?._id || '');

        const newMessage: MessageType = {
            content: message,
            sent_by: 'user',
            user_id: user?._id,
            _id: Math.random().toString(),
            chat: selectedChat._id,
            created_at: new Date().toISOString(),
            file_attachment:{
                file_name: file.name,
                file_path: URL.createObjectURL(file)
            }
        }

        setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
        setLockChat(true);
        (false)

        try {
            const reponse: any = await axios.post(`${BASE_API_URL}/user/chat/send/pdf`, formData, { withCredentials: true });
            const aiMessage: MessageType = {
                content: reponse.data.ai_message,
                sent_by: 'assistant',
                _id: Math.random().toString(),
                chat: selectedChat._id,
                user_id: user?._id,
                created_at: new Date().toISOString()
            };
            setLocalMessages((prevMessages) => [...prevMessages, aiMessage]);
            await axios.get(`${BASE_API_URL}/user/chat/${selectedChat._id}`, { withCredentials: true });
            fetch_user_chats();
        } catch (error: any) {
            NotifyToast({ message: error.response?.data.errors[0] || 'Erro ao enviar a mensagem.', type: 'error'});
        } finally {
            setLockChat(false);
            window.location.reload()
        }
    }

    const export_chats = async () => {
        try {
          const response: any = await axios.get(`${BASE_API_URL}/user/chat/export/${user?._id}`);
          useConvertChatsToPDF(response.data);
        } catch (error) {
            const err = error as any;
            NotifyToast({ message: err.response?.data.errors[0] || 'Não há chats para exportar.', type: 'error'});

        }
      };

    const archive_chats = async (user_id: string) => {
        const response = await axios.get<{ _id: string }[]>(`${BASE_API_URL}/user/chat/all/${user_id}`, { withCredentials: true });
        const chats_ids = response.data.map(chat => chat._id);
        
        if (!chats_ids || chats_ids.length === 0) {
            NotifyToast({ message: 'Nenhum chat encontrado.', type: 'error' });
            return;
        }
    
        try {
            const archiveResponse = await axios.post(
                `${BASE_API_URL}/user/chat/archive/${user_id}`,
                { chats_ids },
                { withCredentials: true }
            );
            NotifyToast({ message: (archiveResponse.data as { message: string }).message || 'Chats arquivados com sucesso', type: 'success' });
            fetch_user_chats();

        } catch (error) {
            const err = error as any;
            console.error('Erro ao arquivar os chats:', err.response?.data.errors || err.message);
            NotifyToast({ message: err.response?.data.errors || err.message, type: 'error' });
        }
    };

    const unarchive_chats = async (user_id: string) => {
        try {
            const response = await axios.get<{ _id: string }[]>(`${BASE_API_URL}/user/chat/archived/${user_id}`, { withCredentials: true });
            const chat_ids = response.data.map(chat => chat._id);

            if (!chat_ids || chat_ids.length === 0) {
                NotifyToast({ message: 'Nenhum chat arquivado encontrado.', type: 'error' });
                return;
            }

            const unarchiveResponse = await axios.post(
                `${BASE_API_URL}/user/chat/unarchive`, 
                { chat_ids, user_id }, 
                { withCredentials: true }
            );
    
            console.log('resposta da api', unarchiveResponse);
    
            NotifyToast({ message: (unarchiveResponse.data as { message: string }).message || 'Chats retirados com sucesso', type: 'success' });
            fetch_user_chats();
    
        } catch (error) {
            console.error('Erro ao retirar os chats:', (error as any).response?.data.errors || (error as any).message);
            const err = error as any;
            NotifyToast({ message: err.response?.data.errors || err.message, type: 'error' });
        }
    };

    const get_archived_chats = async (user_id: string): Promise<void> => {
        try {
            const response = await axios.get<ChatType[]>(`${BASE_API_URL}/user/chat/get/archived/${user_id}`, { withCredentials: true });
            setArchivedChats(response.data.reverse());
        } catch (error) {
          console.error("Erro ao buscar chats arquivados", error);
        }
    };
    
    useEffect(() => {
        fetch_user_chats();
        fetch_side();
    }, [user]);

    return (
        <ChatContext.Provider value={{ 
            chats, 
            selectedChat, 
            add_chat, 
            select_chat, 
            send_message, 
            delete_chat, 
            localMessages, 
            lockChat, 
            clearLocalMessages, 
            send_message_file, 
            delete_all_chats, 
            export_chats,
            archive_chats,
            unarchive_chats,
            get_archived_chats,
            setArchivedChats,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};
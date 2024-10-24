import { ReactNode, createContext, useContext, useEffect, useState } from "react";
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
    send_message_file: (message: string, file: File) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [chats, setChats] = useState<ChatType[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
    const [lockChat, setLockChat] = useState<boolean>(false);
    const { user } = useAuth();

    const [localMessages, setLocalMessages] = useState<MessageType[]>([]);

    const clearLocalMessages = () => {
        setLocalMessages([]);
    };

    const add_chat = async () => {
        if (lockChat) return;
    
        await axios.post(`${BASE_API_URL}/user/chat/create`, { user_id: user?._id }, { withCredentials: true })
            .then(async (res) => {
                NotifyToast({ message: res.data.message, type: 'success' });
                setSelectedChat(res.data.chat);
                fetch_side();
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
        await axios.get(`${BASE_API_URL}/user/chat/all/${user?._id}`, { withCredentials: true }).then(res => {
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
        await axios.get(`${BASE_API_URL}/user/chat/all/${user?._id}`, { withCredentials: true }).then(res => {
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

        try {
            const response = await axios.post(`${BASE_API_URL}/user/chat/send`, {
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

    const send_message_file = async(file: File, message: string) => {
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
            created_at: new Date().toISOString()
        }

        setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
        setLockChat(true);

        try {
            const reponse = await axios.post(`${BASE_API_URL}/user/chat/send/pdf`, formData, { withCredentials: true });
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
        } catch (error) {
            NotifyToast({ message: error.response?.data.errors[0] || 'Erro ao enviar a mensagem.', type: 'error'});
        } finally {
            setLockChat(false);
        }
    }

    useEffect(() => {
        fetch_user_chats();
        fetch_side();
    }, [user]);

    return (
        <ChatContext.Provider value={{ chats, selectedChat, add_chat, select_chat, send_message, delete_chat, localMessages, lockChat, clearLocalMessages, send_message_file }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
};
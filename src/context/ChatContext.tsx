import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ChatType } from "../utils/types/ChatType";
import axios from "axios";
import { BASE_API_URL } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { NotifyToast } from "../components/Toast/Toast";

interface ChatContextType {
    chats: ChatType[],
    add_chat: () => void,
    selectedChat: ChatType | null,
    select_chat: (chat_id: string) => void
    send_message: (message: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const [ chats, setChats ] = useState<ChatType[]>([]);
    const [ selectedChat, setSelectedChat ] = useState<ChatType | null>(null);
    const { user } = useAuth();

    const add_chat = async() => {
        await axios.post(`${BASE_API_URL}/user/chat/create`, { user_id: user?._id }, { withCredentials: true }).then(async(res) => {
            NotifyToast({ message: res.data.message, type: 'success' });
            fetch_user_chats();
            console.log(res.data);
            await axios.get(`${BASE_API_URL}/user/chat/${res.data.chat_id}`, { withCredentials: true }).then(res => {
                setSelectedChat(res.data);
            });
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
            console.log(err);
        });
    }

    const fetch_user_chats = async() => {
        if(!user) {
            return;
        }
        await axios.get(`${BASE_API_URL}/user/chat/all/${user?._id}`, { withCredentials: true}).then( res => {
            setChats(res.data);
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
        })
    }

    const select_chat = (chat_id: string) => {
        const chat = chats.find(chat => chat._id === chat_id);
        if(chat) {
            setSelectedChat(chat);
        }
    }

    const send_message = async(message: string) => {
        if(!selectedChat) {
            return;
        }
        await axios.post(`${BASE_API_URL}/user/chat/send`, { chat_id: selectedChat._id, user_id: user?._id, message }, { withCredentials: true }).then(async() => {
            fetch_user_chats();
            await axios.get(`${BASE_API_URL}/user/chat/${selectedChat._id}`, { withCredentials: true }).then(res => {
                setSelectedChat(res.data);
            })
        }).catch(err => {
            NotifyToast({ message: err.response.data.errors[0], type: 'error' });
        })
    }

    useEffect(() => {
        fetch_user_chats();
    }, [user])

    return (
        <ChatContext.Provider value={{ chats, selectedChat, add_chat, select_chat, send_message }}>
            { children }
        </ChatContext.Provider>
    )
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if(!context) throw new Error('useChat must be used within a ChatProvider');
    return context;
}
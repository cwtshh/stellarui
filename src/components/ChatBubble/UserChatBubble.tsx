import React from 'react'
import { MessageType } from '../../utils/types/ChatType'
import { useAuth } from '../../context/AuthContext'

interface UserChatBubbleProps {
    message: MessageType
}

const UserChatBubble = ( {message} : UserChatBubbleProps) => {

    const { user } = useAuth();
    const first_name = user?.name.split(' ')[0];
    const date = new Date(message.created_at).toLocaleString('pt-br');
    return (
        <div className="chat chat-end">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <div className="chat-header">
                {first_name}
            </div>
            <div className="chat-bubble">{message.content}</div>
            <div className="chat-footer opacity-50">{date}</div>
        </div>
    )
}

export default UserChatBubble
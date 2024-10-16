import React from 'react'
import { MessageType } from '../../utils/types/ChatType'

interface UserChatBubbleProps {
    message: MessageType
}

const UserChatBubble = ( {message} : UserChatBubbleProps) => {

    const date = new Date(message.created_at).toLocaleString('pt-br');
    return (
        <div className="chat chat-end">
            <div className="chat-image avatar"></div>
            <div className="chat-bubble  bg-secondary max-w-[90rem] break-words whitespace-pre-wrap">{message.content}</div>
            <div className="chat-footer text-white opacity-50">{date}</div>
        </div>
    )
}

export default UserChatBubble
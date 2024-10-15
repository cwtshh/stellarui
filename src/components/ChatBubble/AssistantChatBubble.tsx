import React from 'react'

const AssistantChatBubble = ({ message }) => {
    const date = new Date(message.created_at).toLocaleString('pt-br');
    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                <img
                    alt="Tailwind CSS chat bubble component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                </div>
            </div>
            <div className="chat-header text-white">
                Estela
            </div>
            <div className="chat-bubble">{message.content}</div>
            <div className="chat-footer text-white opacity-50">{date}</div>
            {/* <div className="chat-footer opacity-50 text-white">Delivered</div> */}
        </div>
    )
}

export default AssistantChatBubble
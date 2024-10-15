import React from 'react'
import Estela from '../../../src/assets/Estela.jpeg'

const AssistantChatBubble = ({ message }) => {
    const date = new Date(message.created_at).toLocaleString('pt-br');
    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black">
                    <img src={Estela} alt="" />
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
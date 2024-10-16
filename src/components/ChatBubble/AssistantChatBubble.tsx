import React from 'react'
import Estela from '../../../src/assets/Estela.jpeg'

const AssistantChatBubble = ({ message }) => {
    const date = new Date().toLocaleString('pt-br');

    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black">
                    <img src={Estela} alt="Estela" />
                </div>
            </div>
            <div className="chat-header text-white">
                Estela
            </div>

            {message === 'loading' ? (
                <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div> // Mostra um indicador de carregamento
            ) : (
                <div className="chat-bubble">{message.content}</div>
            )}

            <div className="chat-footer text-white opacity-50">{date}</div>
        </div>
    );
}

export default AssistantChatBubble;

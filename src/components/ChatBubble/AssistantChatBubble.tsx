import Estela from '../../../src/assets/Estela.jpeg';
import { MdContentCopy } from "react-icons/md";
import { NotifyToast } from "../../components/Toast/Toast";
import { useState } from 'react';

const AssistantChatBubble = ({ message }) => {
    const date = new Date(message.created_at).toLocaleString('pt-br');
    const [isHovered, setIsHovered] = useState(false);

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        NotifyToast({ message: 'Mensagem copiada com sucesso!', type: 'success' });
    };

    return (
        <div className="chat chat-start max-w-[90rem]">
            <div className="chat-image avatar">
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black">
                    <img src={Estela} alt="Estela" />
                </div>
            </div>
            <div className="chat-header text-white">Estela</div>

            {message === 'loading' ? (
                <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
            ) : (
                <>
                    <div
                        className="chat-bubble indicator"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)} 
                    >
                        <span 
                            className={`indicator-item badge badge-secondary w-[30px] h-[30px] hover:bg-primary transition-opacity transition-transform duration-400 ease-in-out ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                            onClick={() => copyText(message.content)}
                        >
                            <div className='cursor-pointer flex items-center justify-center'>
                                <MdContentCopy className='hover:text-[green] transition' />
                            </div>
                        </span>
                        <div className="grid place-items-center">
                            {message.content.split('\n').map((line: string, index: number) => (
                                <p key={index}>
                                    {line.trim().startsWith('*') ? (
                                        <ul className='list-disc' style={{ paddingLeft: '20px' }}>
                                            <li>{line.trim().slice(1).trim()}</li>
                                        </ul>
                                    ) : (
                                        line
                                    )}
                                </p>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="chat-footer text-white opacity-50 flex justify-between w-full">
                {message === 'loading' ? 
                    <></> : 
                    <>{date}</>}            
            </div>
        </div>
    );
};

export default AssistantChatBubble;

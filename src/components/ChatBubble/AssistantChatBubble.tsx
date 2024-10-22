import Estela from '../../../src/assets/Estela.jpeg';
import HighlightText from '../HighlightText/HighlightText';

const AssistantChatBubble = ({ message }) => {
    const date = new Date(message.created_at).toLocaleString('pt-br');

    return (
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-black">
                    <img src={Estela} alt="Estela" />
                </div>
            </div>
            <div className="chat-header text-white">Estela</div>

            {message === 'loading' ? (
                <div className="w-5 h-5 rounded-full bg-green-500 animate-pulse"></div>
            ) : (
                <div className="chat-bubble">
                    {message.content.split('\n').map((line: string, index: number) => (
                        <p key={index}>
                            {line.trim().startsWith('*') ? (
                                <ul className='list-disc' style={{ paddingLeft: '20px' }}>
                                    <li>{line.trim().slice(1).trim()}</li>
                                </ul>
                            ) : (
                                <HighlightText text={line} />
                            )}
                        </p>
                    ))}
                </div>
            )}

            <div className="chat-footer text-white opacity-50">{message === 'loading' ? <></> : <>{date}</>}</div>
        </div>
    );
};


export default AssistantChatBubble;

import { MessageType } from '../../utils/types/ChatType';
import HighlightText from '../HighlightText/HighlightText';

interface UserChatBubbleProps {
  message: MessageType;
}

const UserChatBubble = ({ message }: UserChatBubbleProps) => {
  const date = new Date(message.created_at).toLocaleString('pt-br');

    return (
        <div className="chat chat-end">
            <div className="chat-image avatar"></div>
            <div className="chat-bubble  bg-secondary max-w-[90rem] break-words whitespace-pre-wrap">
              <HighlightText text={message.content} />
            </div>
            <div className="chat-footer text-white opacity-50">{date.replaceAll(',', ' | ')}</div>
        </div>
    )
}

export default UserChatBubble;

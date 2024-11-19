import { ChatType } from '../../utils/types/ChatType';
import { useChat } from '../../context/ChatContext';
import { MdUnarchive } from "react-icons/md";
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext';

interface ChatCardProps {
  chat: ChatType;
}

const ArchivedCard = ({ chat }: ChatCardProps) => {
  const created_at = new Date(chat.created_at);
  const { select_chat, unarchive_chats, lockChat, selectedChat } = useChat();
  const { user } = useAuth();

  const first_user_message = chat.messages[0]?.content;
  const navigate = useNavigate();

  const isActive = selectedChat?._id === chat._id;

  return (
    <div
      role='button'
      className={`card h-20 shadow-xl p-0 m-0 btn ${isActive ? 'bg-neutral text-white hover:bg-secondary' : 'bg-base-100'} ${lockChat ? 'cursor-not-allowed opacity-50' : ''}`}
      onClick={() => {
        select_chat(chat._id);
        navigate(`/Archived/${chat._id}`);
      }}
    >
      <div>
        <div className="card-body flex items-start justify-left w-full p-0 m-0">
          <div className='flex text-left'>
            <p className='truncate w-[150px] text-ellipsis'>{first_user_message || 'Faça sua solicitação...'}</p>
          </div>
          <p>{created_at.toLocaleString('pt-br').replaceAll(',', ' | ')}</p>
        </div>
      </div>
      <div>
        <button
          disabled={lockChat}
          onClick={() => { 
            if (user?._id) 
              unarchive_chats(user._id, chat._id);
          }}
          className='btn hover:bg-green-700 hover:text-white border-none'
        >
        <MdUnarchive className="text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default ArchivedCard;

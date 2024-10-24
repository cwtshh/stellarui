import HighlightText from '../HighlightText/HighlightText';
import { GoFileSymlinkFile } from "react-icons/go";

const UserChatBubble = ({ message }: any) => {
  const date = new Date(message.created_at).toLocaleString('pt-br');

  console.log(message)

  // Verifica se há um anexo de arquivo
  const file_name = message?.file_attachment?.file_name;
  const file_path = message?.file_attachment?.file_path;

  return (
    <div className="chat chat-end">
      <div className="chat-bubble gap-2 flex flex-col bg-secondary max-w-[90rem] break-words whitespace-pre-wrap">
        {file_name && file_path ? (
          <div className='bg-[#1b794d] mt-2 h-[50px] p-2 gap-2 rounded-xl flex items-center justify-center shadow-[inset_0px_2px_3px_rgba(0,0,0,0.6)]'>
            <GoFileSymlinkFile className='text-3xl text-white' />
            <a 
              href={file_path} 
              download={file_name} 
              className='text-white hover:text-[#6d9ef3] hover:underline transition ease-in-out cursor-pointer flex items-center justify-center'>
              {file_name}
            </a>
          </div>
        ) : null}
        <HighlightText text={message.content} />
      </div>
      <div className="chat-footer text-white opacity-50">{date.replaceAll(',', ' | ')}</div>
    </div>
  );
};

export default UserChatBubble;

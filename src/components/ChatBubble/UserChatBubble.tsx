import HighlightText from '../HighlightText/HighlightText';
import { GoFileSymlinkFile } from "react-icons/go";
import axios from 'axios';
import { BASE_API_URL } from '../../utils/constants';

const UserChatBubble = ({ message }: any) => {
  const date = new Date(message.created_at).toLocaleString('pt-br');

  const file_name = message?.file_attachment?.file_name;
  const file_path = message?.file_attachment?.file_path;
  const clean_filename = file_name?.split('-')[0];

  const handleDownload = async() => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/chat/findfile/${file_name}`, {
        responseType: 'blob'
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  return (
    <div className="chat chat-end">
      <div className="chat-bubble gap-2 flex flex-col bg-secondary max-w-[20rem] lg:max-w-[90rem] break-words whitespace-pre-wrap">
        {file_name && file_path ? (
          <div role='button' onClick={handleDownload} className='bg-[#1b794d] mt-2 h-[50px] p-2 gap-2 rounded-xl flex items-center justify-center shadow-[inset_0px_2px_3px_rgba(0,0,0,0.6)]'>
            <GoFileSymlinkFile className='text-3xl text-white' />
            <a 
              className='text-white hover:text-[#6d9ef3] hover:underline transition ease-in-out cursor-pointer flex items-center justify-center'>
              {clean_filename}
            </a>
          </div>
        ) : null}
        <HighlightText text={message.content} />
      </div>
      <div className="chat-footer text-white opacity-50">{date.split(',')[1].split(':')[0] +':'+ date.split(',')[1].split(':')[1]}     
      </div>
    </div>
  );
};

export default UserChatBubble;

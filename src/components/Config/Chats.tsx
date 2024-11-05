import { RiExportLine } from "react-icons/ri";
import { MdDelete, MdFileOpen } from "react-icons/md";
import { useAuth } from '../../context/AuthContext';
import { BASE_API_URL } from '../../utils/constants';
import axios from 'axios';
import 'jspdf-autotable';
import { useConvertChatsToPDF } from "./useConvertChatsToPDF";
import { useChat } from "../../context/ChatContext";

export default function Chats() {
  const { user } = useAuth();
  const { delete_all_chats } = useChat();

  const handleExportChats = async () => {
    try {
      const response: any = await axios.get(`${BASE_API_URL}/user/chat/export/${user?._id}`);
      console.log(response)
      useConvertChatsToPDF(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-8">
      <h2 className="text-3xl text-black font-bold mb-6 text-green-50 border-b border-green-700 pb-6">Chat Actions</h2>
      <ul className="space-y-4">
        {/* <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportFill className="mr-3 text-2xl" /> 
          <span className="text-lg">Import Charts</span>
        </li> */}
        <li role='button' onClick={handleExportChats} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportLine className="mr-3 text-2xl" /> 
          <span className="text-lg">Exportar Chats</span>
        </li>
        {/* <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <MdFileOpen className="mr-3 text-2xl" /> 
          <span className="text-lg">Archive All Charts</span>
        </li> */}
        <li role='button' onClick={() => delete_all_chats(user?._id)} className="flex items-center text-green-300 hover:text-red-500 transition-colors duration-200 cursor-pointer">
            <MdDelete className="mr-3 text-2xl" /> 
            <span className="text-lg">Deletar todos os Chats</span>
        </li>
      </ul>
    </div>
  );
}
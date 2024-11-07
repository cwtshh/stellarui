import { MdDelete } from "react-icons/md";
import { useAuth } from '../../context/AuthContext';
import 'jspdf-autotable';
import { useChat } from "../../context/ChatContext";
import { RiArchiveStackFill } from "react-icons/ri";
import { IoMdArchive } from "react-icons/io";
import { RiExportFill } from "react-icons/ri";

export default function Chats() {
  const { user } = useAuth();
  const { delete_all_chats, export_chats } = useChat();

  return (
    <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">Chat Actions</h2>
      <ul className="space-y-4">
        <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <IoMdArchive className="mr-3 text-2xl" /> 
          <span className="text-lg">Archive All Chats</span>
        </li>
        <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiArchiveStackFill className="mr-3 text-2xl" /> 
          <span className="text-lg">Archived Chats</span>
        </li>
        <li role='button' onClick={() => export_chats} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportFill className="mr-3 text-2xl" /> 
          <span className="text-lg">Exportar Chats</span>
        </li>
        <li role='button' onClick={() => { if (user?._id) delete_all_chats(user._id); }} className="flex items-center text-green-300 hover:text-red-300 transition-colors duration-200 cursor-pointer">
            <MdDelete className="mr-3 text-2xl" /> 
            <span className="text-lg">Deletar todos os Chats</span>
        </li>
      </ul>
    </div>
  );
}
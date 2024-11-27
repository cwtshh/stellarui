import { MdDelete } from "react-icons/md";
import { useAuth } from '../../../context/AuthContext';
import 'jspdf-autotable';
import { useChat } from "../../../context/ChatContext";
import { RiArchiveStackFill } from "react-icons/ri";
import { IoMdArchive } from "react-icons/io";
import { RiExportFill } from "react-icons/ri";
import ArchivedChats from './ArchivedChats'

export default function Chats() {
  const { user } = useAuth();
  const { delete_all_chats, export_chats, archive_chats, get_archived_chats } = useChat();

  return (
    <div className="w-[350px] lg:w-[600px] bg-green-900 shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">Chat Actions</h2>
      <ul className="space-y-4">

        <dialog id="modal_archive" className="modal modal-center w-full">
          <div className="modal-box bg-green-900 gap-3 w-[360px] lg:w-[470px] items-center flex flex-col">
            <h3 className="font-bold text-white text-lg">Deseja mesmo arquivar todos os seus chats?</h3>
            <div className="flex w-full justify-center gap-5">
              <button className="btn border-none w-[150px] lg:w-[200px] bg-green-800 text-white hover:bg-green-700" onClick={() => { if (user?._id) archive_chats(user?._id); const modal = document.getElementById('modal_archive') as HTMLDialogElement; if (modal) modal.close(); }}>Sim</button>
              <button className="btn border-none w-[150px] lg:w-[200px] bg-red-800 text-white hover:bg-red-600" onClick={() => { const modal = document.getElementById('modal_archive') as HTMLDialogElement; if (modal) modal.close(); }}>Não</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop w-full">
            <button>close</button>
          </form>
        </dialog>

        <li onClick={() => (document.getElementById('modal_archive') as HTMLDialogElement).showModal()} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <IoMdArchive className="mr-3 text-2xl" /> 
          <span className="text-lg">Archive All Chats</span>
        </li>

        <dialog id="modal_archived" className="modal modal-center">
          <div className="modal-box scroll-hidden gap-3 items-center lg:min-w-[800px] flex flex-col bg-green-900 shadow-lg rounded-lg p-8">
            <h3 className="font-bold text-white text-3xl border-b border-green-700 pb-6 flex w-full items-center justify-between">
              Arquivados
              <div className=" w-[20px] h-[20px] cursor-pointer transform-transition easy-in-out duration-300 text-xl hover:text-gray-300" onClick={() => (document.getElementById('modal_archived') as HTMLDialogElement).close()}>X</div>
            </h3>
            <div className="flex w-full justify-between pb-2 pt-2 gap-5">
              <ArchivedChats/>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop w-full">
            <button>close</button>
          </form>
        </dialog>

        <li onClick={() => {if(user?._id)  get_archived_chats(user?._id); const modal = document.getElementById('modal_archived') as HTMLDialogElement; if (modal) modal.showModal();}} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiArchiveStackFill className="mr-3 text-2xl" /> 
          <span className="text-lg">Archived Chats</span>
        </li>
        <li role='button' onClick={() => export_chats()} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportFill className="mr-3 text-2xl" />
          <span className="text-lg">Exportar Chats</span>
        </li>

        <dialog id="modal_delete" className="modal modal-center w-full">
          <div className="modal-box bg-green-900 gap-3 w-[360px] lg:w-[470px] items-center flex flex-col">
            <h3 className="font-bold text-white text-lg">Deseja mesmo excluir todos os seus chats?</h3>
            <div className="flex w-full justify-center gap-5">
              <button className="btn border-none w-[150px] lg:w-[200px] bg-green-800 text-white hover:bg-green-700" onClick={() => { if (user?._id) delete_all_chats(user._id); const modal = document.getElementById('modal_delete') as HTMLDialogElement; if (modal) modal.close(); }}>Sim</button>
              <button className="btn border-none w-[150px] lg:w-[200px] bg-red-800 text-white hover:bg-red-600" onClick={() => { const modal = document.getElementById('modal_delete') as HTMLDialogElement; if (modal) modal.close(); }}>Não</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop w-full">
            <button>close</button>
          </form>
        </dialog>

        <li onClick={() => (document.getElementById('modal_delete') as HTMLDialogElement).showModal()} className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <MdDelete className="mr-3 text-2xl" /> 
          <span className="text-lg">Deletar todos os Chats</span>
        </li>
      </ul>
    </div>
  );
}
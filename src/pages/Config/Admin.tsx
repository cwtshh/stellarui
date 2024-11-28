import { useState, useRef, useEffect } from 'react';
import { X, Users, Database } from 'lucide-react';
import { FaUserAstronaut } from "react-icons/fa6";
import { useChat } from '../../context/ChatContext';
import { UserType } from '../../utils/types/UserType';

const AdminModal = ({ isOpen, onClose }: any) => {
  const [selectedSection, setSelectedSection] = useState('Database');
  const modalRef = useRef<HTMLDivElement>(null)

  const { get_all_users, get_all_chats, export_chats, handleAdminOpened } = useChat();
  const [allUser, setAllUser] = useState<UserType[]>([]);

  const handleExportAllChatsUser = async () => {
      const users = await get_all_users();
      console.log("Usuários:", users);

      const allChats: { [key: string]: any[] } = {};

      for (const user of users) {
        const chats = await get_all_chats(user._id);
        allChats[user._id] = chats;
      }

      console.log("Chats de todos os usuários:", allChats);
      export_chats(allChats);
  };

  const handleDownloadDataBase = () => {
    // Implementação para download do banco de dados
  };

  useEffect(() => {
    const fetchAllUser = async () => {
      const users = await get_all_users();
      setAllUser(users);
    }
    fetchAllUser();
  }, [get_all_users]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
        handleAdminOpened()
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="relative w-[400px] lg:w-full lg:max-w-5xl bg-green-900 rounded-lg shadow-xl">
        <button 
          onClick={() => {onClose(); handleAdminOpened()}}
          className="absolute top-6 right-4 text-green-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="border-b flex justify-center border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          <div className="w-[160px] lg:w-64 border-r border-green-700 p-4">
            <nav className="space-y-2">
              <NavItem 
                selected={selectedSection === 'Usuarios'} 
                onClick={() => setSelectedSection('Usuarios')} 
                icon={<Users size={20} />} 
                label="Users" 
              />
              <NavItem 
                selected={selectedSection === 'Database'} 
                onClick={() => setSelectedSection('Database')} 
                icon={<Database size={20} />} 
                label="Database" 
              />
            </nav>
          </div>

          <div className="flex-1 p-3 lg:p-6">
            {selectedSection === 'Database' && (
              <div className="mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">Database</h3>
                <div className="space-y-3 flex flex-col">
                  <button onClick={() => handleDownloadDataBase()}>
                    <DatabaseItem label="Download Database"/>
                  </button>
                  <button onClick={() => handleExportAllChatsUser()}>
                    <DatabaseItem label="Export All Chats (All Users)" />
                  </button>
                </div>
              </div>
            )}
            {selectedSection === 'Usuarios' && (
              <div className="mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-4">Users</h3>
                <div className="space-y-3">
                  {allUser.map((user) => (
                    <div key={user._id} className='flex gap-2 lg:gap-4 items-center lg:pr-3 lg:pl-4'>
                      <FaUserAstronaut className="text-green-300 text-xl lg:text-2xl"/>
                      <div className='flex justify-between w-full'>
                        <p className="text-green-300 lg:text-xl">{user.name}</p>
                        <p className="text-green-100 lg:text-xl">({user.role})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick, selected }: any) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-3 w-full px-3 py-2 ${selected ? 'bg-green-800 text-white' : 'text-green-300'} hover:text-white hover:bg-green-800 rounded-lg transition-colors`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const DatabaseItem = ({ label }: any) => (
  <button className="flex items-center text-[14px] lg:text-xl gap-1 lg:gap-2 w-full px-2 lg:px-4 py-1 lg:py-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
    <Database size={18} />
    <span>{label}</span>
  </button>
);

export default AdminModal;

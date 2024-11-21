import { useState, useRef, useEffect } from 'react';
import { X, Users, Database } from 'lucide-react';
import { FaUserAstronaut } from "react-icons/fa6";
import { useChat } from '../../../context/ChatContext';
import { UserType } from '../../../utils/types/UserType';


const AdminModal = ({ isOpen, onClose }: any) => {
  const [selectedSection, setSelectedSection] = useState('Database');
  const modalRef = useRef<HTMLDivElement>(null)

  const { get_all_users } = useChat();
  const [allUser, setAllUser] = useState<UserType[]>([]);

  useEffect (() => {
    const fetchAllUser = async () => {
      const users = await get_all_users();
      setAllUser(users);
    }
    fetchAllUser()
  }, [get_all_users])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
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
      <div ref={modalRef} className="relative w-full max-w-5xl bg-green-900 rounded-lg shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-4 text-green-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="border-b flex justify-center border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          <div className="w-64 border-r border-green-700 p-4">
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

          <div className="flex-1 p-6">
            {selectedSection === 'Database' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Database</h3>
                <div className="space-y-3">
                  {/* <DatabaseItem label="Import Config from JSON File" />
                  <DatabaseItem label="Export Config to JSON File" /> */}
                  {/* <DatabaseItem label="Export LiteLLM config.yaml" /> */}
                  <DatabaseItem label="Download Database" />
                  <DatabaseItem label="Export All Chats (All Users)" />
                </div>
              </div>
            )}
            {selectedSection === 'Usuarios' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Users</h3>
                <div className="space-y-3">
                {allUser.map((users) => (
                  <div key={users._id} className='flex gap-4 items-center pr-3 pl-4'>
                    <FaUserAstronaut className="text-green-300 text-2xl"/>
                    <div className='flex justify-between w-full '>
                      <p className="text-green-500 text-xl">{users.name}</p>
                      <p className="text-green-100 text-xl">({users.role})</p>
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
  <button className="flex items-center gap-2 w-full px-4 py-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
    <Database size={18} />
    <span>{label}</span>
  </button>
);

export default AdminModal;

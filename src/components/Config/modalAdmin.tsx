import React, { useState } from 'react';
import { X, Settings, Users, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Modal = ({ isOpen, onClose }) => {
    const [selectedSection, setSelectedSection] = useState('Database');
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleConfiguracoesClick = () => {
        setSelectedSection('Configuracoes');
        navigate('/configuracoes/geral');
        onClose();
    };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl h-[90vh] bg-green-900 rounded-lg shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-green-400 hover:text-white"
        >
          <X size={24} />
        </button>

        <div className="border-b border-green-700 p-6">
          <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          <div className="w-64 border-r border-green-700 p-4">
            <nav className="space-y-2">
              <NavItem icon={<Settings size={20} />} label="Configuracoes" onClick={handleConfiguracoesClick} />
              <NavItem icon={<Users size={20} />} label="Usuarios" onClick={() => setSelectedSection('Usuarios')} />
              <NavItem icon={<Database size={20} />} label="Database" onClick={() => setSelectedSection('Database')} />
            </nav>
          </div>

          <div className="flex-1 p-6">
            {selectedSection === 'Database' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Database</h3>
                <div className="space-y-3">
                  <DatabaseItem label="Import Config from JSON File" />
                  <DatabaseItem label="Export Config to JSON File" />
                  <DatabaseItem label="Download Database" />
                  <DatabaseItem label="Export All Chats (All Users)" />
                  <DatabaseItem label="Export LiteLLM config.yaml" />
                </div>
              </div>
            )}
            {selectedSection === 'Usuarios' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Usuarios</h3>
                <div className="space-y-3">
                  <p className='text-green-500'>Manage users here...</p>
                </div>
              </div>
            )}
            {selectedSection === 'Configuracoes' && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Configuracoes</h3>
                <p className='text-white'>Manage settings here...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 w-full px-3 py-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
    {icon}
    <span>{label}</span>
  </button>
);

const DatabaseItem = ({ label }) => (
  <button className="flex items-center gap-2 w-full px-4 py-2 text-green-300 hover:text-white hover:bg-green-800 rounded-lg transition-colors">
    <Database size={18} />
    <span>{label}</span>
  </button>
);

export default Modal;
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  Users,
  Database,
  Layout,
} from 'lucide-react';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-300">
      <div className="p-4 border-b border-neutral-800">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <div className="flex gap-4 mt-2">
          <button className="px-3 py-1 text-sm hover:bg-neutral-800 rounded">Dashboard</button>
          <button className="px-3 py-1 text-sm hover:bg-neutral-800 rounded">Settings</button>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 p-4 border-r border-neutral-800">
          <nav>
            <ul className="space-y-2">
              <NavItem icon={<Settings size={18} />} label="General" />
              <NavItem icon={<Users size={18} />} label="Users" />
              <NavItem icon={<Layout size={18} />} label="Connections" />
            </ul>
          </nav>
        </div>

        <div className="flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Database</h2>
            <ul className="space-y-3">
              <DatabaseItem label="Import Config from JSON File" />
              <DatabaseItem label="Export Config to JSON File" />
              <DatabaseItem label="Download Database" />
              <DatabaseItem label="Export All Chats (All Users)" />
              <DatabaseItem label="Export LiteLLM config.yaml" />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label }) => (
  <li>
    <Link
      to="#"
      className="flex items-center gap-3 px-3 py-2 rounded hover:bg-neutral-800 transition-colors duration-150"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  </li>
);

const DatabaseItem = ({ label }) => (
  <li>
    <button className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors duration-150">
      <Database size={16} />
      {label}
    </button>
  </li>
);

export default AdminPanel;
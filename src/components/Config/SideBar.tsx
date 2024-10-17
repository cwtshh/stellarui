import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Config() {
  return (
    <div className="flex h-full w-full">
      <div className="w-80 bg-base-200 p-4">
        <ul className="menu text-base-content">
          <li><Link to="/configuracoes/geral">General</Link></li>
          <li><Link to="/configuracoes/perfil">Perfil</Link></li>
          <li><Link to="/configuracoes/AdminPainel">Admin Painel</Link></li>
          <li><Link to="/configuracoes/chats">Chats</Link></li>
        </ul>
      </div>
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  );
}
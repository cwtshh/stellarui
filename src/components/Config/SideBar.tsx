import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Modal from "./modalAdmin";

export default function Config() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen w-screen bg-green-900">
      <div className="w-64 bg-primary-700 p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-green-50 mb-6">Settings</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/configuracoes/geral"
              className="text-green-200 hover:text-green-100 transition-colors duration-200"
            >
              General
            </Link>
          </li>
          <li>
            <Link
              to="/configuracoes/perfil"
              className="text-green-200 hover:text-green-100 transition-colors duration-200"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={openModal}
              className="text-green-200 hover:text-green-100 transition-colors duration-200"
            >
              Admin Panel
            </button>
          </li>
          <li>
            <Link
              to="/configuracoes/Chats"
              className="text-green-200 hover:text-green-100 transition-colors duration-200"
            >
              Chats
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex-1 p-8 bg-secondary shadow-inner rounded-lg">
        <Outlet />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}
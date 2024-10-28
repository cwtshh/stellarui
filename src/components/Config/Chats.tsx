import React from 'react';
import { RiExportFill, RiExportLine } from "react-icons/ri";
import { MdDelete, MdFileOpen } from "react-icons/md";

export default function Chats() {
  return (
    <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-8">
      <h2 className="text-3xl text-black font-bold mb-6 text-green-50 border-b border-green-700 pb-6">Chat Actions</h2>
      <ul className="space-y-4">
        <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportFill className="mr-3 text-2xl" /> 
          <span className="text-lg">Import Charts</span>
        </li>
        <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <RiExportLine className="mr-3 text-2xl" /> 
          <span className="text-lg">Export Charts</span>
        </li>
        <li className="flex items-center text-green-300 hover:text-green-100 transition-colors duration-200 cursor-pointer">
          <MdFileOpen className="mr-3 text-2xl" /> 
          <span className="text-lg">Archive All Charts</span>
        </li>
        <li className="flex items-center text-green-300 hover:text-red-500 transition-colors duration-200 cursor-pointer">
          <MdDelete className="mr-3 text-2xl" /> 
          <span className="text-lg">Delete All Charts</span>
        </li>
      </ul>
    </div>
  );
}
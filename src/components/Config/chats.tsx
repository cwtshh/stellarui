import React from 'react'
import { RiExportFill, RiExportLine } from "react-icons/ri";
import { MdDelete, MdFileOpen } from "react-icons/md";

export default function Chats() {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg p-6 max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Chart Actions</h2>
      <ul className="space-y-3">
        <li className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200">
          <RiExportFill className="mr-2" /> 
          <span>Import Charts</span>
        </li>
        <li className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200">
          <RiExportLine className="mr-2" /> 
          <span>Export Charts</span>
        </li>
        <li className="flex items-center text-gray-300 hover:text-blue-400 transition-colors duration-200">
          <MdFileOpen className="mr-2" /> 
          <span>Archive All Charts</span>
        </li>
        <li className="flex items-center text-gray-300 hover:text-red-400 transition-colors duration-200">
          <MdDelete className="mr-2" /> 
          <span>Delete All Charts</span>
        </li>
      </ul>
    </div>
  )
}
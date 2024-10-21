import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';

export default function ProfileEdit() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      avatar: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="max-w-md mx-auto bg-green-500 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-50">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-green-200 mb-2">
            <FaUser className="inline mr-2" />
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-green-200 mb-2">
            <FaEnvelope className="inline mr-2" />
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-green-200 mb-2">
            <FaLock className="inline mr-2" />
            New Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-green-200 mb-2">
            <FaLock className="inline mr-2" />
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="avatar" className="block text-sm font-medium text-green-200 mb-2">
            <FaImage className="inline mr-2" />
            Profile Picture
          </label>
          <input
            type="file"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
            accept="image/*"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
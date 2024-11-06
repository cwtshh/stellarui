import { useState } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { NotifyToast } from '../../components/Toast/Toast';

export default function ProfileEdit() {
  const { user, update } = useAuth(); 
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
    avatar: null
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (formData.password !== '' && formData.confirmPassword == ''){
      NotifyToast({ message: 'Por favor, repita a nova senha.', type: 'info' });
      return
    }

    if (formData.password !== formData.confirmPassword){
      NotifyToast({ message: 'As senhas não estão compatíveis!', type: 'error' });
      return
    }
    
    const updateData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    if (user) {
      await update(user._id, updateData); 
    }
  };

  return (
    <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">Edit Profile</h2>
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
            className="w-full p-[11px] input bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"
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
            className="w-full p-[11px] input bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"
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
            placeholder='********'
            className="w-full p-[11px] input bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"
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
            placeholder='********'
            onChange={handleInputChange}
            className="w-full p-[11px] input bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
          Save Changes
        </button>
      </form>
    </div>
  );
}

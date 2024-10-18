import React, { useState } from 'react';

export default function Geral() {
  const [language, setLanguage] = useState('');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  return (
    <div className="max-w-md mx-auto bg-green-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-50">General Settings</h2>
      <div className="mb-4">
        <label htmlFor="language" className="block text-sm font-medium text-green-200 mb-2">Language</label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
        >
          <option value="">Select a language</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="systemPrompt" className="block text-sm font-medium text-green-200 mb-2">System Prompt</label>
        <input
          type="text"
          id="systemPrompt"
          className="w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
        />
      </div>
      <button className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
        Save
      </button>
    </div>
  );
}

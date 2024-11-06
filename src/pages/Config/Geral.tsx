export default function Geral() {
  // const [language, setLanguage] = useState('');

  // const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setLanguage(event.target.value);
  // };

  return (
    <div className="w-[600px] bg-green-900 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-50 border-b border-green-700 pb-6">General Settings</h2>
      {/* <div className="mb-4">
        <label htmlFor="language" className="block text-sm font-medium text-green-200 mb-2">Language</label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="cursor-pointer w-full p-2 bg-green-700 border border-green-600 rounded-md text-green-100 focus:ring-green-400 focus:border-green-400"
        >
          <option hidden value="">Select a language</option>
          <option value="pt-br">Português</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div> */}
      <div className="mb-4">
        <label htmlFor="systemPrompt" className="block text-sm font-medium text-green-200 mb-2">System Prompt</label>
        <textarea
          id="systemPrompt"
          rows={4} 
          className="w-full p-[11px] textarea bg-green-700 border-green-600 text-green-100 focus:ring-green-400 focus:border-green-400"
        />
      </div>
      <button className="w-full bg-green-600 text-green-50 py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200">
        Save
      </button>
    </div>
  );
}

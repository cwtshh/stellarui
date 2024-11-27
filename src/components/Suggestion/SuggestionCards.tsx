import { useChat } from "../../context/ChatContext";

interface SuggestionCardsProps {
    locked: boolean;
}

const SuggestionCards: React.FC<SuggestionCardsProps> = ({ locked }) => {
    const { send_message } = useChat();

    const handleSuggestion = (message: any) => {
        const suggestion = message.target.textContent; 
        if (suggestion.trim()) {
            let asking = 'Fale sobre ' + suggestion
            send_message(asking);
        }
    }

    return (
        <div className="hidden lg:flex gap-5 w-full justify-center items-center">
            <button disabled={locked} onClick={handleSuggestion} className='btn lg:min-w-[112px] h-[52px] bg-white p-4 rounded-2xl hover:bg-gray-200 cursor-pointer'>Casos de Uso</button>
            <button disabled={locked} onClick={handleSuggestion} className='btn lg:min-w-[112px] h-[52px] bg-white p-4 rounded-2xl hover:bg-gray-200 cursor-pointer'>Jogos em Lançamento</button>
            <button disabled={locked} onClick={handleSuggestion} className='btn lg:min-w-[112px] h-[52px] bg-white p-4 rounded-2xl hover:bg-gray-200 cursor-pointer'>Teoria de Grafos</button>
            <button disabled={locked} onClick={handleSuggestion} className='btn lg:min-w-[112px] h-[52px] bg-white p-4 rounded-2xl hover:bg-gray-200 cursor-pointer'>Cores primárias</button>
            <button disabled={locked} onClick={handleSuggestion} className='btn lg:min-w-[112px] h-[52px] bg-white rounded-2xl hover:bg-gray-200'>Leis Trabalhistas</button>
        </div>
    )
}

export default SuggestionCards;

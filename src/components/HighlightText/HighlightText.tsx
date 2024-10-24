import { RiErrorWarningFill } from "react-icons/ri";

interface HighlightTextProps {
    text: string;
}

const HighlightText = ({ text }: HighlightTextProps) => {
    const parts = text.split(/(\*\*[^*]+\*\*| - )/g);
    return (
        <p>
            {parts.map((part, index) => {
                // Se for o texto com **
                if (part.match(/\*\*[^*]+\*\*/)) {
                    const cleanText = part.replace(/\*\*/g, '');
                    return <strong key={index}>{cleanText}</strong>;
                }

                // Se for o símbolo "-" isolado com espaços, aplica tabulação
                if (part === ' - ') {
                    return <span key={index} style={{ marginLeft: '30px' }}></span>; // Simula tabulação
                }

                if (part.trim() === 'Erro ao enviar mensagem.') {
                    return (
                        <p className="flex items-center gap-2 text-red-500">
                            <RiErrorWarningFill />
                            {part}
                        </p>
                     ) // Aplica destaque
                }

                // Texto normal
                return <span key={index}>{part}</span>;
            })}
        </p>
    )
}

export default HighlightText;
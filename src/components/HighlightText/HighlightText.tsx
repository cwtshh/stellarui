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
                    return <span key={index} style={{ marginLeft: '20px' }}></span>; // Simula tabulação
                }

                // Texto normal
                return <span key={index}>{part}</span>;
            })}
        </p>
    )
}

export default HighlightText;
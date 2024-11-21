import jsPDF from 'jspdf';
import logo from '../../../assets/logo.jpg';

interface ChatData {
    user: {
        name: string;
    };
    chats: {
        messages: {
            content: string;
            created_at: string;
            sent_by: string;
        }[];
    }[];
}

export const useConvertChatsToPDF = async (data: ChatData) => {
    const username = data.user.name;

    // const user = localStorage.getItem('stellar@auth_user') ? JSON.parse(localStorage.getItem('user') as string) : null;
    const document = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgRight = logo;
    const imgXPosition = document.internal.pageSize.width - 60 - 110;
    document.addImage(imgRight, 'JPG', imgXPosition, 5, 130, 30);

    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 60;
    const marginBottom = 20;

    const titleMaxWidth = document.internal.pageSize.width - marginLeft - marginRight;
    const splitTitle = document.splitTextToSize(`Chats de ${username}`, titleMaxWidth);

    const titleHeight = splitTitle.length * 7;

    // Configuração do título principal
    document.setFontSize(17);
    document.setTextColor(110, 161, 247);
    document.setFont('helvetica', 'bold');
    splitTitle.forEach((line: string, index: number) => {
        document.text(line, document.internal.pageSize.width / 2, marginTop - 15 + (index * 7), { align: 'center' });
    });
    document.setTextColor(0, 0, 0);

    let yPos = marginTop + titleHeight;

    const lineHeight = 10;
    const pageHeight = document.internal.pageSize.height;

    data.chats.reverse().forEach((chat: any) => {
        const firstMsg = chat.messages[0]?.content || "Mensagem não encontrada";

        // Desenhar linha verde antes do chat
        document.setDrawColor(1, 56, 13);
        document.setLineWidth(3);
        document.line(marginLeft, yPos - 5, document.internal.pageSize.width - marginRight, yPos - 5);
        
        const chatTitleMarginTop = 10; 
        yPos += chatTitleMarginTop; // Adiciona a margem antes do título do chat
        
        // Ajustar o tamanho da fonte e definir a fonte como negrito
        document.setFontSize(18); 
        document.setFont('helvetica', 'bold');
        
        // Calcular a largura do texto do título
        const chatTitle = `Chat: ${firstMsg}`;
        const chatTitleWidth = document.getTextWidth(chatTitle);
        
        // Calcular a posição x para centralizar
        const xPos = (document.internal.pageSize.width - chatTitleWidth) / 2;
        
        // Desenhar o título centralizado
        document.text(chatTitle, xPos, yPos);
        yPos += 15;

        document.setFontSize(12);
        document.setFont('helvetica', 'normal');

        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight - 20;

        chat.messages.forEach((message: any) => {
            const messageDate = new Date(message.created_at).toLocaleString();
            const sender = message.sent_by === 'user' ? username : 'Estela';
        
            // Nome do remetente com ":" e um espaço adicional no final
            document.setFont('helvetica', 'bold');
            const senderLine = `${sender}: `;
            
            // Verificar se há espaço para o bloco completo (remetente + mensagem + data)
            const safeMarginBottom = marginBottom + (3 * lineHeight); // Ajuste a margem para considerar o bloco completo
            if (yPos + (lineHeight * 3) > pageHeight - safeMarginBottom) {
                document.addPage();
                yPos = marginTop - 30;
            }
        
            // Adiciona o remetente e calcula a largura do texto do remetente para o próximo texto
            document.text(senderLine, marginLeft, yPos);
            const senderWidth = document.getTextWidth(senderLine); // Largura do remetente para calcular o início da mensagem
        
            // Mensagem em itálico
            document.setFont('helvetica', 'italic');
            const messageText = message.content;
            const fullMessageLine = `${messageText} (${messageDate.split(',')[1].trim()})`;
        
            const splitMessage = document.splitTextToSize(fullMessageLine, textMaxWidth);
        
            // Renderizar o texto
            splitMessage.forEach((line: string, index: number) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop - 30;
                }
                if (index === 0) {
                    // Coloca o texto da mensagem logo após o remetente com um pequeno espaço
                    document.text(line, marginLeft + senderWidth + 1, yPos);
                } else {
                    document.text(line, marginLeft, yPos);
                }
                yPos += lineHeight;
            });
        
            // Adiciona a data em negrito na linha abaixo da mensagem
            const dateLine = messageDate.split(',')[0];
            document.setFont('helvetica', 'bold');
            const dateSplit = document.splitTextToSize(dateLine, textMaxWidth);
            dateSplit.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop - 30;
                }
                document.text(line, marginLeft, yPos);
                yPos += lineHeight;
            });
        
            yPos += lineHeight; // Espaço adicional após cada mensagem
        });
        

    });

    const addPageNumbers = () => {
        const pageCount = document.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            document.setPage(i);
            document.setFont('helvetica', 'bold');
            document.setFontSize(10);
            document.text(`${i} de ${pageCount}`, document.internal.pageSize.width / 2, pageHeight - marginBottom, { align: 'center' });
        }
    };
    addPageNumbers();
    document.save(`Chats_${username}.pdf`);
}

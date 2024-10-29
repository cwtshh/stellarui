import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpg';

export const useConvertChatsToPDF = async (data: any[]) => {
    const username = data.user.name;

    const user = localStorage.getItem('stellar@auth_user') ? JSON.parse(localStorage.getItem('user') as string) : null;
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
    splitTitle.forEach((line, index) => {
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

        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight;

        chat.messages.forEach((message: any) => {
            const messageDate = new Date(message.created_at).toLocaleString();
            const sender = message.sent_by === 'user' ? username : 'Estela';
        
            // Mensagem em negrito para o remetente
            document.setFont('helvetica', 'bold');
            const senderLine = `${sender}: `; // Inclui apenas o remetente
        
            // Adiciona o remetente
            document.text(senderLine, marginLeft, yPos);
        
            // Mensagem em itálico
            document.setFont('helvetica', 'italic');
            const messageText = message.content; // Texto da mensagem
            const fullMessageLine = `${messageText} (${messageDate.split(',')[1].trim()})`; // Mensagem com hora
        
            // Calcula a largura total do texto (remetente + mensagem + hora)
            const totalText = fullMessageLine; // Texto completo
            const splitMessage = document.splitTextToSize(totalText, textMaxWidth);
            
            // Adiciona a mensagem e a hora na mesma linha
            splitMessage.forEach((line: string, index: number) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop - 30; // Reseta a posição vertical
                }
                // Se não for a primeira linha, precisa ajustar a posição para a mensagem
                if (index === 0) {
                    document.text(line, marginLeft + document.getTextWidth(senderLine), yPos); // Ajusta a posição x para a mensagem
                } else {
                    document.text(line, marginLeft, yPos); // Continua na mesma posição
                }
                yPos += lineHeight; // Atualiza a posição vertical
            });
        
            // Adiciona a data em negrito na linha abaixo da mensagem
            const dateLine = messageDate.split(',')[0]; // Data
            document.setFont('helvetica', 'bold'); // Define a fonte como negrito para a data
            const dateSplit = document.splitTextToSize(dateLine, textMaxWidth);
            dateSplit.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop - 30; // Reseta a posição vertical
                }
                document.text(line, marginLeft, yPos); // Adiciona a data
                yPos += lineHeight; // Atualiza a posição vertical
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

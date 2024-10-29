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
        
        // Adicionar o título do chat
        const chatTitleMarginTop = 5; // Margem superior para o título do chat
        yPos += chatTitleMarginTop; // Adiciona a margem antes do título do chat
        document.setFontSize(18); // Ajusta o tamanho da fonte
        document.setFont('helvetica', 'bold'); // Define a fonte como negrito
        document.text(`Chat: ${firstMsg}`, marginLeft, yPos);
        yPos += lineHeight;

        // Adiciona espaçamento extra antes de desenhar as mensagens
        yPos += 5;

        document.setFontSize(12);
        document.setFont('helvetica', 'normal');

        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight;

        chat.messages.forEach((message: any) => {
            // Divide a mensagem em linhas que se ajustam à largura máxima
            const messageDate = new Date(message.created_at).toLocaleString();
            const sender = message.sent_by === 'user' ? username : 'Estela';
            const messageText = `${sender}: ${message.content} ${messageDate.split(',')[1]}`;
            const splitMessage = document.splitTextToSize(messageText, textMaxWidth);

            splitMessage.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop; // Reseta a posição vertical
                }
                document.text(line, marginLeft, yPos);
                yPos += lineHeight; // Atualiza a posição vertical
            });

            // Adiciona a data em uma linha separada
            const dateSplit = document.splitTextToSize(messageDate.split(',')[0], textMaxWidth);
            dateSplit.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop; // Reseta a posição vertical
                }
                document.text(line, marginLeft, yPos);
            });

            yPos += lineHeight * 2; // Espaço adicional após cada mensagem
        });

        yPos += lineHeight; 
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

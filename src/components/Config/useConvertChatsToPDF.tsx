import jsPDF from 'jspdf'
import logo from '../../assets/logo.jpg';

export const useConvertChatsToPDF = async(data: any[]) => {
    const username = data.user.name

    const firstMsg = data?.chats?.[0]?.messages?.[0]?.content || "Mensagem não encontrada";

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

    document.setFontSize(17);
    document.setTextColor(110, 161, 247);
    document.setFont('helvetica', 'bold');
    splitTitle.forEach((line, index) => {
        document.text(line, document.internal.pageSize.width / 2, marginTop - 15 + (index * 7), { align: 'center' });
    });
    document.setTextColor(0, 0, 0);

    let yPos = marginTop + titleHeight;

    document.setDrawColor(1, 56, 13);
    document.setLineWidth(3);
    document.line(marginLeft, yPos - 5, document.internal.pageSize.width - marginRight, yPos - 5);

    yPos += 10;
    const lineHeight = 10;
    const pageHeight = document.internal.pageSize.height;

    data.chats.forEach((chat: any) => {
        if (yPos + lineHeight > pageHeight - marginBottom) {
            document.addPage();
            yPos = marginTop;
        }
        document.text(`Chat: ${firstMsg}`, marginLeft, yPos);
        document.setFontSize(12);
        document.setFont('helvetica', 'normal');

        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight;
        chat.messages.forEach((message: any) => {
            yPos += lineHeight;
            const splitMessage = document.splitTextToSize(`Mensagem: ${message.content}`, textMaxWidth);
            splitMessage.forEach((line: string) => {
                if (yPos + lineHeight > pageHeight - marginBottom) {
                    document.addPage();
                    yPos = marginTop;
                }
                document.text(line, marginLeft, yPos);
                yPos += lineHeight;
            });
            yPos += lineHeight;
            document.text(`Enviado em: ${new Date(message.created_at).toLocaleString()}`, marginLeft, yPos);
            yPos += lineHeight;
        });
        yPos += lineHeight * 3;
        document.text(`Enviado em: ${new Date(chat.created_at).toLocaleString()}`, marginLeft, yPos);
        yPos += lineHeight;
    });

    const addPageNumbers = () => {
        const pageCount = document.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            document.setPage(i);
            document.setFontSize(10);
            document.text(`${i} de ${pageCount}`, document.internal.pageSize.width / 2, pageHeight - marginBottom, { align: 'center' });
        }
    };
    addPageNumbers();
    document.save(`Chats_${username}.pdf`);
}
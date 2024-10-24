import 'jspdf-autotable';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpg';

const time_span = (seconds: number) => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 3600 % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const downloadTranscriptionPDF = async (file: any, segments: any[]) => {
    const document = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgRight = logo; 
    const imgXPosition = document.internal.pageSize.width - 60 - 110;
    document.addImage(imgRight, 'JPG', imgXPosition, 5, 130, 30);

    const marginLeft = 15;  
    const marginRight = 15;  
    const marginTop = 60;    
    const marginBottom = 20; 

    document.setFontSize(17);
    document.setTextColor(110, 161, 247);
    document.setFont('helvetica', 'bold');
    document.text(`Transcrição de ${file?.name.replace(/\.[^/.]+$/, "")}`, document.internal.pageSize.width / 2, marginTop - 15, { align: 'center' });
    document.setTextColor(0, 0, 0);

    document.setDrawColor(1, 56, 13);
    document.setLineWidth(3);
    document.line(marginLeft, marginTop - 10, document.internal.pageSize.width - marginRight, marginTop - 10);

    let yPos = marginTop + 10; // Adiciona uma margem extra de 10 mm abaixo da linha verde
    const lineHeight = 10;
    const pageHeight = document.internal.pageSize.height;

    segments.forEach((item, index) => {
        const timeStamp = time_span(item.start) + ' - ' + time_span(item.end) + ':';
        const timeStampWidth = document.getTextWidth(timeStamp);
    
        // Verifique se o espaço restante é suficiente para adicionar o timestamp
        if (yPos + lineHeight + 5 > pageHeight - marginBottom) {
            document.addPage();
            yPos = marginTop - 30; 
        }
    
        // Adiciona o timestamp
        document.setFontSize(14);
        document.setFont('helvetica', 'italic');
        document.text(timeStamp, marginLeft, yPos);
    
        // Calcula a largura máxima do texto
        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight - (timeStampWidth + 22);
        const splitText = document.splitTextToSize(item.text, textMaxWidth);
    
        // Adiciona o texto logo abaixo do timestamp
        const textStartX = marginLeft + timeStampWidth + (index === 0 ? -1 : 5); // Ajusta apenas para o primeiro item
        document.setFontSize(15);
        document.setFont('helvetica', 'bold');
    
        // Adiciona o texto
        splitText.forEach((line) => {
            // Verifique se o espaço restante é suficiente para adicionar a linha de texto
            if (yPos + lineHeight > pageHeight - marginBottom) {
                document.addPage();
                yPos = marginTop - 30; 
            }
            document.text(line, textStartX, yPos);
            yPos += lineHeight; // Move para a próxima linha
        });
    
        yPos += 5; // Adiciona espaço entre os itens
    });
    

    const addPageNumbers = () => {
        const pageCount = document.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            document.setPage(i);
            document.setFontSize(10);
            document.text(`${i} de ${pageCount}`, document.internal.pageSize.width / 2, pageHeight - marginBottom, { align: 'center' });
        }
    };

    addPageNumbers();
    document.save(`Transcricao_${(file?.name).replace(/\.[^/.]+$/, "")}.pdf`);
};

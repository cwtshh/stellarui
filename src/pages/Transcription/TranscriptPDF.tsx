import 'jspdf-autotable';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpg';

const time_span = (seconds: number) => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor(seconds % 3600 / 60);
    let s = Math.floor(seconds % 3600 % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const downloadTranscriptionPDF = async (file: any, segments: any[], speakerMap: any) => {
    const document = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const imgRight = logo; 
    const imgXPosition = document.internal.pageSize.width - 60 - 110;
    document.addImage(imgRight, 'JPG', imgXPosition, 5, 130, 30);

    const marginLeft = 15;  
    const marginRight = 15;  
    const marginTop = 60;    
    const marginBottom = 20; 

    const titleMaxWidth = document.internal.pageSize.width - marginLeft - marginRight;
    const splitTitle = document.splitTextToSize(`Transcrição de ${file?.name.replace(/\.[^/.]+$/, "")}`, titleMaxWidth);
    
    const titleHeight = splitTitle.length * 7;
    
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
    
    document.setDrawColor(1, 56, 13);
    document.setLineWidth(3);
    document.line(marginLeft, yPos - 5, document.internal.pageSize.width - marginRight, yPos - 5);
    
    yPos += 10;

    segments.forEach((item) => {
        const speaker = speakerMap[item.speaker] + ' - ';
        const timeStamp = `(${time_span(item.start)} - ${time_span(item.end)}):`;
    
        document.setFontSize(12);
        document.setFont('helvetica', 'bold');
    
        const speakerWidth = document.getTextWidth(speaker);
    
        const currentHeightNeeded = lineHeight * 2 + 3; // Espaço necessário para speaker, timestamp e uma linha de texto
    
        // Verificar se há espaço suficiente para o bloco completo
        const safeMarginBottom = marginBottom + currentHeightNeeded;
        if (yPos + currentHeightNeeded > pageHeight - safeMarginBottom) {
            document.addPage();
            yPos = marginTop - 30;
        }
    
        // Adicionar o nome do palestrante
        document.text(speaker, marginLeft, yPos);
        document.setFontSize(12);
        document.setFont('helvetica', 'italic');
        document.text(timeStamp, marginLeft + speakerWidth, yPos);
    
        const textMaxWidth = document.internal.pageSize.width - marginLeft - marginRight - 20;
        const splitText = document.splitTextToSize(item.text, textMaxWidth);
    
        let textYPos = yPos + lineHeight;
    
        // Adicionar o conteúdo do texto com verificação de página
        splitText.forEach((line: any) => {
            if (textYPos + lineHeight > pageHeight - marginBottom) {
                document.addPage();
                textYPos = marginTop - 30;
            }
            document.setFontSize(12);
            document.setFont('helvetica', 'italic');
            document.text(line, marginLeft, textYPos);
            textYPos += lineHeight;
        });
    
        yPos += lineHeight + 30;
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
    document.save(`Transcricao_${(file?.name).replace(/\.[^/.]+$/, "")}.pdf`);
};

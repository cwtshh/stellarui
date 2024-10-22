import 'jspdf-autotable';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.jpg'; // Verifique se está correto

const time_span = (seconds: number) => {
  let h = Math.floor(seconds / 3600);
  let m = Math.floor(seconds % 3600 / 60);
  let s = Math.floor(seconds % 3600 % 60);

  return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const downloadTranscriptionPDF = async (file: any, segments: any[]) => {
    const document = new jsPDF();

    const imgRight = logo; 
    const imgXPosition = document.internal.pageSize.width - 60 - 110; // 110 é a largura da imagem, 30 é a margem
    document.addImage(imgRight, 'JPG', imgXPosition, 5, 130, 30); // Topo direito

    // Centraliza o título abaixo das logos
    document.setFont('bold');
    document.setFontSize(16); // Tamanho da fonte do título
    document.text(`Transcrição de ${file?.name}`, document.internal.pageSize.width / 2, 45, { align: 'center' }); // Ajusta a posição Y para 50

    // Barra verde separadora
    document.setDrawColor(1, 56, 13); // Verde
    document.setLineWidth(3);
    document.line(10, 50, 200, 50); // Barra da primeira página

    // Variáveis para controle de texto e páginas
    let yPos = 60; 
    const lineHeight = 10;
    const pageHeight = document.internal.pageSize.height;
    const marginBottom = 20;

    // Função para adicionar texto com paginação
    const addTextWithPagination = (text: string, x: number) => {
        const splitText = document.splitTextToSize(text, 180); // Quebra automática de linhas

        splitText.forEach((line: string) => {
            if (yPos + lineHeight > pageHeight - marginBottom) {
                document.addPage(); // Criar nova página se exceder o limite
                yPos = 20; // Resetar yPos para nova página

                // Adicionar barra verde em novas páginas
                document.setDrawColor(0, 255, 0); 
                document.setLineWidth(3);
                document.line(10, 15, 200, 15); // Barra nas páginas subsequentes
            }
            document.text(line, x, yPos); // Adicionar linha
            yPos += lineHeight;
        });
    };

    // Adicionar os segmentos de transcrição
    segments.forEach((item) => {
        const timeStamp = time_span(item.start) + ' - ' + time_span(item.end);

        // Adiciona o timestamp em itálico
        document.setFont('italic'); // Define a fonte para itálico
        const timeStampWidth = document.getTextWidth(timeStamp);
        const timestampText = timeStamp; // Armazena o texto do timestamp

        // Adiciona o timestamp com paginação
        addTextWithPagination(timestampText, 10); // Usa a função de paginação para o timestamp

        // Adiciona o texto em negrito
        document.setFont('bold'); // Define a fonte para negrito
        const itemTextX = 10 + timeStampWidth + 5; // Define a posição X do texto
        const itemText = item.text; // Armazena o texto do item
        addTextWithPagination(itemText, itemTextX); // Usa a função de paginação para o texto
    });

    // Função para adicionar números de página
    const addPageNumbers = () => {
        const pageCount = document.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            document.setPage(i);
            document.setFontSize(10);
            document.text(`Página ${i} de ${pageCount}`, 105, pageHeight - 10, { align: 'center' });
        }
    };

    // Adicionar números de página após todo o conteúdo
    addPageNumbers();

    // Salvar o PDF
    document.save(`Transcrição_${file?.name}.pdf`);
};

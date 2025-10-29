import React, { useMemo, useState } from 'react';
import jsPDF from 'jspdf';
import Button from './Button';

interface StructureDisplayProps {
  structure: string;
  episodeTitle: string;
  onReset: () => void;
}

const StructureDisplay: React.FC<StructureDisplayProps> = ({ structure, episodeTitle, onReset }) => {
  const [isCopied, setIsCopied] = useState(false);

  const parsedSections = useMemo(() => {
    const sections: { title: string; items: string[] }[] = [];
    let currentSection: { title: string; items: string[] } | null = null;

    structure.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      const titleMatch = trimmedLine.match(/^\*\*(.*)\*\*$/);
      if (titleMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: titleMatch[1], items: [] };
      } else if (currentSection && trimmedLine.match(/^\d+\.\s/)) {
        currentSection.items.push(trimmedLine.replace(/^\d+\.\s/, ''));
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }, [structure]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;
    const lineHeightMultiplier = 1.4;

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // Main Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    const titleLines = doc.splitTextToSize(`"${episodeTitle}"`, contentWidth);
    const titleHeight = titleLines.length * 22;
    checkPageBreak(titleHeight);
    doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleHeight + 10;

    // Subtitle
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(128, 128, 128);
    const subtitle = 'Una pauta para encender la conversación.';
    const subtitleHeight = 12 * lineHeightMultiplier;
    checkPageBreak(subtitleHeight);
    doc.text(subtitle, pageWidth / 2, y, { align: 'center' });
    y += subtitleHeight * 3;

    // Content Sections
    parsedSections.forEach(section => {
      doc.setTextColor(0, 0, 0);
      
      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      const sectionTitleLines = doc.splitTextToSize(section.title, contentWidth);
      const sectionTitleHeight = sectionTitleLines.length * 16 * lineHeightMultiplier;
      checkPageBreak(sectionTitleHeight + 10);
      doc.text(sectionTitleLines, margin, y);
      y += sectionTitleHeight + 5;

      // Section Items
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      section.items.forEach(item => {
        const itemLines = doc.splitTextToSize(item.trim(), contentWidth - 20); // Indent for bullet
        const itemHeight = itemLines.length * 11 * lineHeightMultiplier;
        checkPageBreak(itemHeight);
        
        doc.text("•", margin, y, { baseline: 'top' });
        doc.text(itemLines, margin + 20, y, { baseline: 'top' });
        y += itemHeight + 6; // Space between items
      });

      y += 20; // Space between sections
    });
    
    const safeTitle = episodeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`pauta_${safeTitle || 'podcast'}.pdf`);
  };
  
  const handleCopyText = () => {
    const textToCopy = structure
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/^\s*\d+\.\s/gm, '• ')   // Replace numbered lists with bullets
      .trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert('No se pudo copiar el texto.');
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
        <div className="bg-[#FDFDFC] p-8 sm:p-12 rounded-2xl shadow-sm border border-black/5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tighter mb-2 text-center">"{episodeTitle}"</h1>
            <p className="text-lg text-brand-dark/60 mb-10 text-center">Una pauta para encender la conversación.</p>
            
            <div className="space-y-10">
              {parsedSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <h2 className="text-2xl font-bold text-brand-dark mb-4 tracking-tight">{section.title}</h2>
                  <ul className="list-none space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-brand-dark/90 leading-relaxed text-lg">
                        <span className="text-brand-orange font-bold mr-3 text-xl">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button onClick={handleDownloadPDF}>Descargar PDF</Button>
            <button
                onClick={handleCopyText}
                className="w-full px-6 py-4 bg-transparent text-brand-dark font-bold rounded-lg hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-beige focus:ring-brand-dark/50 transition-all duration-300 transform active:scale-95">
                {isCopied ? '¡Copiado!' : 'Copiar Texto'}
            </button>
            <button 
                onClick={onReset} 
                className="w-full px-6 py-4 bg-transparent text-brand-dark font-bold rounded-lg hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-beige focus:ring-brand-dark/50 transition-colors duration-300 transform active:scale-95">
                Crear otra
            </button>
      </div>
    </div>
  );
};

export default StructureDisplay;
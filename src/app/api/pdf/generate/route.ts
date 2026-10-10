import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      childName = 'Hero',
      theme,
      themeName,
      orientation = 'portrait',
      coverImage,
      pages = []
    } = body;

    const resolvedTheme = themeName || theme || 'Adventure';
    const isLandscape = orientation === 'landscape';

    // Letter size: Portrait (612 x 792 pt), Landscape (792 x 612 pt)
    const doc = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const getImageData = async (src: string): Promise<string> => {
      if (src.startsWith('data:image')) return src;
      const res = await fetch(src);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const contentType = res.headers.get('content-type') || 'image/png';
      return `data:${contentType};base64,${base64}`;
    };

    // 1. FRONT COVER (NO DISTORTION, ZERO TOP CLIPPING)
    if (coverImage) {
      const coverData = await getImageData(coverImage);
      const imgProps = doc.getImageProperties(coverData);
      const imgRatio = imgProps.width / imgProps.height;
      const pageRatio = pageWidth / pageHeight;

      let drawW = pageWidth;
      let drawH = pageHeight;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > pageRatio) {
        // Wider image: match height, center horizontally
        drawH = pageHeight;
        drawW = pageHeight * imgRatio;
        drawX = -(drawW - pageWidth) / 2;
        drawY = 0;
      } else {
        // Taller image: anchor to y = 0 so the top title is 100% visible
        drawW = pageWidth;
        drawH = pageWidth / imgRatio;
        drawX = 0;
        drawY = 0;
      }

      doc.addImage(coverData, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST');
    }

    // 2. DEDICATION / TITLE PAGE (Inside Page 1)
    doc.addPage();
    doc.setFillColor(255, 253, 249);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.text(`${childName}'s`, pageWidth / 2, pageHeight * 0.32, { align: 'center' });
    doc.text(`${resolvedTheme} Coloring Book`, pageWidth / 2, pageHeight * 0.40, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.setTextColor(100, 116, 139);
    doc.text('A personalized coloring adventure created just for you!', pageWidth / 2, pageHeight * 0.48, { align: 'center' });

    // Dedication signature line
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text('Colored with love by: ________________________________', pageWidth / 2, pageHeight * 0.58, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('Published by MyColoringStar • www.mycoloringstar.com', pageWidth / 2, pageHeight - 50, { align: 'center' });
    doc.text('Customer Support: support@mycoloringstar.com', pageWidth / 2, pageHeight - 35, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} MyColoringStar. All rights reserved.`, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // 3. INTERIOR COLORING PAGES
    for (let i = 0; i < pages.length; i++) {
      const pageSrc = pages[i];
      if (pageSrc) {
        doc.addPage();
        const pageData = await getImageData(pageSrc);
        const imgProps = doc.getImageProperties(pageData);
        const imgRatio = imgProps.width / imgProps.height;

        const margin = 24;
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;

        let w = maxW;
        let h = maxW / imgRatio;

        if (h > maxH) {
          h = maxH;
          w = maxH * imgRatio;
        }

        const x = margin + (maxW - w) / 2;
        const y = margin + (maxH - h) / 2;

        doc.addImage(pageData, 'PNG', x, y, w, h, undefined, 'FAST');
      }
    }

    // Convert jsPDF to ArrayBuffer to bypass Vercel's 4.5MB JSON payload limit
    const pdfArrayBuffer = doc.output('arraybuffer');
    const filename = `MyColoringStar_${childName.replace(/\s+/g, '_')}_${resolvedTheme.replace(/\s+/g, '_')}.pdf`;

    return new NextResponse(pdfArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Filename': filename
      }
    });

  } catch (err: any) {
    console.error('PDF Build error:', err);
    return NextResponse.json({ error: err.message || 'Failed to construct PDF.' }, { status: 500 });
  }
}
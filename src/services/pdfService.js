import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PRIMARY_COLOR = [30, 58, 138];

export const generateAnalisisPDF = (analisis, solicitud) => {
  const doc = new jsPDF();
  let y = 50;

  const drawHeader = () => {
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('ANÁLISIS FINANCIERO', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
  };
  drawHeader();

  const addField = (label, value, x) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}: `, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '---'), x + doc.getTextWidth(`${label}: `), y);
  };

  const addImages = (photos, title) => {
    if (!photos || photos.length === 0) return;
    const validPhotos = photos.filter(p => p && p.startsWith('data:image'));
    if (validPhotos.length === 0) return;
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFont('helvetica', 'bold');
    doc.text(`📸 ${title}:`, 15, y);
    y += 5;
    let x = 15;
    validPhotos.forEach(p => {
       try { doc.addImage(p, 'JPEG', x, y, 60, 45); x += 65; } catch(e){}
    });
    y += 55;
  };

  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE Y NEGOCIO', 15, y);
  y += 10;
  doc.setTextColor(0,0,0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  addField('Cliente', solicitud?.nombre, 15);
  addField('Negocio', solicitud?.nombreNegocio, 110);
  y += 8;
  addField('Actividad', solicitud?.act1, 15);
  y += 12;

  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INDICADORES FINANCIEROS', 15, y);
  y += 10;
  doc.setTextColor(0,0,0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  addField('Semana Baja', `$${analisis.semBaja}`, 15);
  addField('Semana Alta', `$${analisis.semAlta}`, 110);
  y += 10;

  if (analisis.inventario?.length > 0) {
    doc.autoTable({
      startY: y,
      head: [['Producto', 'Cant', 'Costo', 'Venta', 'Total']],
      body: analisis.inventario.map(i => [i.producto, i.cant, `$${i.costo}`, `$${i.venta}`, `$${(i.cant * i.costo).toFixed(2)}`]),
      theme: 'striped',
      headStyles: { fillColor: PRIMARY_COLOR }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  addImages([analisis.licencias], 'Licencias y Permisos');

  doc.save(`Analisis_${solicitud?.nombre?.replace(/\s+/g, '_')}.pdf`);
};

export const generateSolicitudPDF = (solicitud) => {
  const doc = new jsPDF();
  let y = 50;
  
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('SOLICITUD DE CRÉDITO', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });

  const addField = (label, value, x) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0,0,0);
    doc.text(`${label}: `, x, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '---'), x + doc.getTextWidth(`${label}: `), y);
  };

  y = 55;
  addField('Solicitante', solicitud.nombre, 15);
  addField('Cédula', solicitud.cedula, 110);
  y += 8;
  addField('Teléfono', solicitud.telefono, 15);
  y += 12;

  doc.setFont('helvetica', 'bold');
  doc.text('Crédito Solicitado:', 15, y);
  y += 8;
  addField('Monto', `$${solicitud.monto} ${solicitud.moneda}`, 15);
  addField('Propósito', solicitud.proposito, 110);
  y += 15;

  const validPhotos = [solicitud.cedulaFoto1, solicitud.cedulaFoto2, ...(solicitud.fotos || [])].filter(p => p && p.startsWith('data:image'));
  let x = 15;
  validPhotos.forEach(p => {
    if (y > 240) { doc.addPage(); y = 20; }
    try { doc.addImage(p, 'JPEG', x, y, 60, 45); x += 65; if (x > 150) { x = 15; y += 50; } } catch(e){}
  });

  doc.save(`Solicitud_${solicitud.nombre?.replace(/\s+/g, '_')}.pdf`);
};

export const generateFullClientPDF = (data) => {
  const { prospeccion, solicitud, analisis } = data;
  const doc = new jsPDF();
  let y = 50;

  // Header helpers
  const drawHeader = () => {
    doc.setFillColor(...PRIMARY_COLOR);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPEDIENTE INTEGRAL DEL CLIENTE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Financiera Pro - Generado el: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });
  };

  drawHeader();

  const addTitle = (title) => {
    if (y > 250) { doc.addPage(); y = 30; }
    y += 10;
    doc.setFillColor(245, 245, 245);
    doc.rect(10, y - 8, 190, 10, 'F');
    doc.setDrawColor(...PRIMARY_COLOR);
    doc.line(10, y - 8, 10, y + 2);
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, y);
    y += 12;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  const addField = (label, value, x, labelWidthMod = 0) => {
    doc.setFont('helvetica', 'bold');
    const labelStr = `${label}: `;
    doc.text(labelStr, x, y);
    doc.setFont('helvetica', 'normal');
    const valStr = String(value || '---');
    const labelWidth = doc.getTextWidth(labelStr);
    doc.text(valStr, x + labelWidth + labelWidthMod, y);
  };

  const addImages = (photos, title) => {
    if (!photos || photos.length === 0) return;
    const validPhotos = photos.filter(p => p && p.startsWith('data:image'));
    if (validPhotos.length === 0) return;

    if (y > 200) { doc.addPage(); y = 20; }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`📸 ${title}:`, 15, y);
    y += 5;

    let x = 15;
    const imgWidth = 60;
    const imgHeight = 45;
    const spacing = 5;

    validPhotos.forEach((photo) => {
      if (x + imgWidth > 200) {
        x = 15;
        y += imgHeight + spacing;
        if (y > 250) { doc.addPage(); y = 20; x = 15; }
      }
      try {
        doc.addImage(photo, 'JPEG', x, y, imgWidth, imgHeight);
        x += imgWidth + spacing;
      } catch (err) {
        console.error("Error al añadir imagen al PDF", err);
      }
    });
    y += imgHeight + 15;
  };

  // 1. PROSPECCIÓN
  if (prospeccion) {
    addTitle('1. CATEGORÍA: PROSPECCIÓN');
    addField('Fecha de Visita', prospeccion.fecha, 15);
    addField('Estado del Prospecto', prospeccion.estado?.toUpperCase(), 110);
    y += 8;
    addField('Nombre del Solicitante', prospeccion.nombre, 15);
    addField('Teléfono/WhatsApp', prospeccion.telefono, 110);
    y += 8;
    addField('Lugar de Contacto', prospeccion.lugar, 15);
    addField('Monto Interés', `$${prospeccion.monto}`, 110);
    y += 10;
  }

  // 2. SOLICITUD
  if (solicitud) {
    addTitle('2. CATEGORÍA: SOLICITUD DE CRÉDITO');
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text('DATOS PERSONALES', 15, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
    
    addField('Identificación (Cédula)', solicitud.cedula, 15);
    addField('Edad', solicitud.edad ? `${solicitud.edad} años` : '---', 110);
    y += 8;
    addField('Fecha Nacimiento', solicitud.fechaNac || '---', 15);
    addField('Estado Civil', solicitud.estadoCivil, 110);
    y += 8;
    addField('Nacionalidad', solicitud.nacionalidad, 15);
    addField('Escolaridad', solicitud.escolaridad, 110);
    y += 8;
    addField('Dependientes', solicitud.dependientes, 15);
    addField('Teléfono', solicitud.telefono, 110);
    y += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección Domicilio:', 15, y);
    doc.setFont('helvetica', 'normal');
    const fullDir = `${solicitud.direccion || ''} ${solicitud.barrio || ''}`.trim();
    doc.text(fullDir || '---', 50, y);
    y += 8;
    addField('Condición Vivienda', solicitud.condicionVivienda, 15);
    addField('Años Vivienda', solicitud.anosVivienda, 110);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text('INFORMACIÓN DEL BENEFICIARIO', 15, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
    addField('Nombre Benef.', solicitud.beneficiario, 15);
    addField('Cédula Benef.', solicitud.cedulaBenef, 110);
    y += 8;
    addField('Parentesco', solicitud.parentesco, 15);
    addField('Tel. Benef.', solicitud.telBenef, 110);
    y += 12;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text('INFORMACIÓN DEL NEGOCIO', 15, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
    addField('Nombre Negocio', solicitud.nombreNegocio, 15);
    addField('Años Funcionando', solicitud.anosNegocio, 110);
    y += 8;
    addField('Actividad Principal', solicitud.act1, 15);
    addField('Municipio', solicitud.munNegocio, 110);
    y += 8;
    addField('Propósito Crédito', solicitud.proposito, 15);
    addField('Horario', solicitud.horario, 110);
    y += 15;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.text('CRÉDITO SOLICITADO', 15, y);
    doc.setTextColor(0, 0, 0);
    y += 8;
    addField('Monto solicitado', `${solicitud.monto || '0'} ${solicitud.moneda || 'USD'}`, 15);
    addField('Frecuencia Pago', solicitud.frecuencia, 110);
    y += 15;

    // Photos for Solicitud Section
    const cedulaPhotos = [solicitud.cedulaFoto1, solicitud.cedulaFoto2].filter(Boolean);
    addImages(cedulaPhotos, 'Documento de Identidad');
    addImages(solicitud.fotos, 'Evidencia del Negocio y Garantías');
  }

  // 3. ANÁLISIS
  if (analisis) {
    addTitle('3. CATEGORÍA: ANÁLISIS FINANCIERO');
    doc.setFont('helvetica', 'bold');
    doc.text('FLUJO DE CAJA ESTIMADO:', 15, y);
    y += 8;
    addField('Semana Baja', `$${analisis.semBaja || '0'}`, 15);
    addField('Semana Alta', `$${analisis.semAlta || '0'}`, 110);
    const promedio = ((parseFloat(analisis.semBaja || 0) + parseFloat(analisis.semAlta || 0)) / 2).toFixed(2);
    y += 8;
    addField('Promedio Estimado', `$${promedio}`, 15);
    y += 12;

    if (analisis.inventario?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('DETALLE DE INVENTARIO:', 15, y);
      y += 5;
      doc.autoTable({
        startY: y,
        head: [['Producto', 'Cantidad', 'Costo Unit.', 'Precio Venta', 'Total Costo']],
        body: analisis.inventario.map(i => [
          i.producto, i.cant, `$${i.costo}`, `$${i.venta}`,
          `$${(parseFloat(i.cant || 0) * parseFloat(i.costo || 0)).toFixed(2)}`
        ]),
        theme: 'striped',
        headStyles: { fillColor: PRIMARY_COLOR, fontSize: 9 },
        styles: { fontSize: 8 },
        margin: { left: 15 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (analisis.gastos?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('GASTOS FAMILIARES:', 15, y);
      y += 5;
      doc.autoTable({
        startY: y,
        head: [['Concepto', 'Monto ($)']],
        body: analisis.gastos.map(g => [g.concepto, `$${g.monto}`]),
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 100], fontSize: 9 },
        styles: { fontSize: 8 },
        margin: { left: 15 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (analisis.referencias?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('REFERENCIAS PERSONALES:', 15, y);
      y += 5;
      const refBody = analisis.referencias.filter(r => r.nombre).map(r => [
        r.nombre, r.parentesco, r.telefono
      ]);
      if (refBody.length > 0) {
        doc.autoTable({
          startY: y,
          head: [['Nombre Completo', 'Parentesco', 'Teléfono de Contacto']],
          body: refBody,
          theme: 'grid',
          headStyles: { fillColor: [60, 60, 60], fontSize: 9 },
          styles: { fontSize: 8 },
          margin: { left: 15 }
        });
        y = doc.lastAutoTable.finalY + 15;
      }
    }

    addImages([analisis.licencias], 'Documentación Legal / Licencias');
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(220, 220, 220);
    doc.line(10, 282, 200, 282);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`GestorPro MC - Documento Confidencial - Página ${i} de ${pageCount}`, 105, 288, { align: 'center' });
  }

  const fileName = `Expediente_${prospeccion?.nombre?.replace(/\s+/g, '_') || 'Cliente'}.pdf`;
  doc.save(fileName);
};

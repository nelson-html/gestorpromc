import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const PRIMARY_COLOR = [30, 58, 138];

export const generateAnalisisPDF = (analisis, solicitud) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text('FINANCIERA PRO - ANÁLISIS FINANCIERO', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 105, 30, { align: 'center' });
  
  let y = 50;
  
  const addSectionTitle = (title) => {
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
  };

  addSectionTitle('INFORMACIÓN DEL CLIENTE');
  doc.text(`Nombre: ${solicitud.nombre || 'N/A'}`, 10, y);
  doc.text(`Teléfono: ${solicitud.telefono || 'N/A'}`, 100, y);
  y += 7;
  doc.text(`Dirección: ${solicitud.direccion || 'N/A'}, ${solicitud.barrio || ''}`, 10, y);
  y += 7;
  doc.text(`Edad: ${solicitud.edad || 'N/A'} años | Estado Civil: ${solicitud.estadoCivil || 'N/A'}`, 10, y);
  y += 15;

  addSectionTitle('INFORMACIÓN DEL NEGOCIO');
  doc.text(`Nombre: ${solicitud.nombreNegocio || 'N/A'}`, 10, y);
  doc.text(`Actividad: ${solicitud.actPred || solicitud.act1 || 'N/A'}`, 100, y);
  y += 7;
  doc.text(`Dirección: ${solicitud.dirNegocio || 'N/A'}`, 10, y);
  y += 7;
  doc.text(`Municipio: ${solicitud.munNegocio || 'N/A'}`, 10, y);
  doc.text(`Años funcionando: ${solicitud.anosNegocio || 'N/A'}`, 100, y);
  y += 15;

  addSectionTitle('ANÁLISIS FINANCIERO');
  const promedio = analisis.semBaja && analisis.semAlta ? ((parseFloat(analisis.semBaja) + parseFloat(analisis.semAlta)) / 2).toFixed(2) : '0';
  doc.text(`Ventas - Semana Baja: $${analisis.semBaja || '0'}`, 10, y);
  doc.text(`Semana Alta: $${analisis.semAlta || '0'}`, 70, y);
  doc.text(`Promedio: $${promedio}`, 130, y);
  y += 15;

  if (analisis.inventario?.length > 0) {
    doc.autoTable({
      startY: y,
      head: [['Producto', 'Cant', 'Costo', 'Venta', 'Total']],
      body: analisis.inventario.map(i => [
        i.producto, i.cant, `$${i.costo}`, `$${i.venta}`, 
        `$${(parseFloat(i.cant || 0) * parseFloat(i.costo || 0)).toFixed(2)}`
      ]),
      theme: 'striped',
      headStyles: { fillColor: PRIMARY_COLOR },
      margin: { left: 10, right: 10 }
    });
    y = doc.lastAutoTable.finalY + 15;
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generado por Financiera Pro - ${new Date().toLocaleString()}`, 105, 285, { align: 'center' });
  
  doc.save(`Analisis_${solicitud.nombre?.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
};

export const generateSolicitudPDF = (solicitud) => {
  const doc = new jsPDF();
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('SOLICITUD DE CRÉDITO', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Financiera Pro - ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  let y = 55;
  doc.setTextColor(0,0,0);
  doc.setFontSize(12);
  doc.text(`Solicitante: ${solicitud.nombre}`, 10, y);
  y += 10;
  doc.text(`Negocio: ${solicitud.nombreNegocio}`, 10, y);
  y += 10;
  doc.text(`Monto Solicitado: $${solicitud.monto} ${solicitud.moneda}`, 10, y);
  
  doc.save(`Solicitud_${solicitud.nombre?.replace(/\s+/g, '_')}.pdf`);
};

export const generateFullClientPDF = (data) => {
  const { prospeccion, solicitud, analisis } = data;
  const doc = new jsPDF();
  let y = 50;

  // Header
  doc.setFillColor(...PRIMARY_COLOR);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text('EXPEDIENTE COMPLETO DEL CLIENTE', 105, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleString()}`, 105, 30, { align: 'center' });

  const addTitle = (title) => {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFillColor(240, 240, 240);
    doc.rect(10, y - 5, 190, 8, 'F');
    doc.setTextColor(...PRIMARY_COLOR);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 12, y);
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
  };

  const addField = (label, value, x) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, x, y);
    doc.setFont('helvetica', 'normal');
    const valStr = String(value || 'N/A');
    doc.text(valStr, x + doc.getTextWidth(`${label}: `), y);
  };

  // 1. PROSPECCIÓN
  addTitle('1. DATOS DE PROSPECCIÓN');
  addField('Fecha', prospeccion.fecha, 15);
  addField('Estado', prospeccion.estado?.toUpperCase(), 110);
  y += 7;
  addField('Nombre', prospeccion.nombre, 15);
  addField('Teléfono', prospeccion.telefono, 110);
  y += 7;
  addField('Lugar', prospeccion.lugar, 15);
  addField('Monto Interés', `$${prospeccion.monto}`, 110);
  y += 15;

  // 2. SOLICITUD (if exists)
  if (solicitud) {
    addTitle('2. SOLICITUD DE CRÉDITO');
    addField('Cédula', solicitud.cedula || '---', 15);
    addField('Edad', solicitud.edad ? `${solicitud.edad} años` : '---', 110);
    y += 7;
    addField('Estado Civil', solicitud.estadoCivil, 15);
    addField('Nacionalidad', solicitud.nacionalidad, 110);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`${solicitud.direccion || ''} ${solicitud.barrio || ''}`, 35, y);
    y += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text('DATOS DEL NEGOCIO:', 15, y);
    y += 7;
    addField('Nombre Negocio', solicitud.nombreNegocio, 15);
    addField('Años Neg.', solicitud.anosNegocio, 110);
    y += 7;
    addField('Actividad', solicitud.act1, 15);
    addField('Propósito', solicitud.proposito, 110);
    y += 15;
  }

  // 3. ANÁLISIS (if exists)
  if (analisis) {
    addTitle('3. ANÁLISIS FINANCIERO');
    addField('Semana Baja', `$${analisis.semBaja}`, 15);
    addField('Semana Alta', `$${analisis.semAlta}`, 110);
    y += 10;

    if (analisis.inventario?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.text('INVENTARIO:', 15, y);
      y += 5;
      doc.autoTable({
        startY: y,
        head: [['Producto', 'Cant', 'Costo', 'Total']],
        body: analisis.inventario.map(i => [
          i.producto, i.cant, `$${i.costo}`, 
          `$${(parseFloat(i.cant || 0) * parseFloat(i.costo || 0)).toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: { fillColor: [100, 100, 100] },
        styles: { fontSize: 8 }
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (analisis.referencias?.length > 0) {
      addTitle('REFERENCIAS PERSONALES');
      const refBody = analisis.referencias.filter(r => r.nombre).map(r => [
        r.nombre, r.parentesco, r.telefono
      ]);
      if (refBody.length > 0) {
        doc.autoTable({
          startY: y,
          head: [['Nombre', 'Parentezco', 'Teléfono']],
          body: refBody,
          theme: 'plain',
          styles: { fontSize: 9 }
        });
        y = doc.lastAutoTable.finalY + 10;
      }
    }
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Página ${i} de ${pageCount}`, 105, 285, { align: 'center' });
  }

  doc.save(`Expediente_${prospeccion.nombre?.replace(/\s+/g, '_')}.pdf`);
};

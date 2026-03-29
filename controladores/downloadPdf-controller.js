const PDFDocument = require('pdfkit');
const Turno = require('../modelos/Turno');
const Empresa = require('../modelos/Empresa');

const generarComprobante = async (req, res) => {
  try {

    const turno = await Turno.findById(req.params.id);
    if (!turno) {
      return res.json({ 
        error: true,
        mensaje: "Turno no encontrado" 
      });
    }

    const empresa = await Empresa.findById(turno.empresaId);

    const color = empresa.colorTema || "#000000";
    
    const doc = new PDFDocument({
      size: "A4",
      margin: 50
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=comprobante-turno-${turno._id}.pdf`
    );

    doc.pipe(res);

    // HEADER
    doc
      .fillColor(color)
      .fontSize(22)
      .text(empresa.name, { align: "center" });

    doc
        .fillColor("#000")
      .fontSize(14)
      .text("Comprobante de Turno", { align: "center" });

    doc.moveDown(1);

    doc
        .strokeColor(color)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(2);

    // DATOS DEL TURNO

    doc.fontSize(12);

    doc.text(`Código de turno: ${turno._id}`);
    doc.moveDown();

    doc.text(`Cliente: ${turno.nombre}`);
    doc.moveDown();

    doc.text(`Teléfono: ${turno.telefono}`);
    doc.moveDown();

    doc.text(`Fecha: ${turno.fecha}`);
    doc.moveDown();

    doc.text(`Hora: ${turno.hora}`);
    doc.moveDown();

    doc.text(`Estado: ${turno.estado}`);

    doc.moveDown(3);

    doc
        .strokeColor(color)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();

    doc.moveDown(2);

    doc
      .fontSize(10)
      .text(
        "Este comprobante certifica la reserva del turno. Preséntelo al momento de asistir.",
        { align: "center" }
      );

    doc.moveDown();

    doc
      .fontSize(9)
      .text(
        `Generado el ${new Date().toLocaleString("es-AR")}`,
        { align: "center" }
      );

    doc.end();

  } catch (error) {
    res.status(500).json({ 
      mensaje: "Error generando comprobante",
      error
    });
  }
};

module.exports = { generarComprobante };
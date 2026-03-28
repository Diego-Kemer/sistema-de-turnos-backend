const Turno = require('../modelos/Turno.js');

const obtenerTurnosPorEmpresa = async (req, res) => {

  try {

    const { empresaId } = req.params;

    const turnos = await Turno.find({ empresaId })

    res.json(turnos);

  } catch (error) {

    res.status(500).json({
      mensaje: "Error al obtener turnos"
    });

  }

};

module.exports = {obtenerTurnosPorEmpresa}
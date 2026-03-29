const Empresa = require('../modelos/Empresa');
const Turno = require('../modelos/Turno');
const Cliente = require('../modelos/Cliente')
const generarSlots = require('../utils/generarSlots');

const turnosDisponibles = async (req, res) => {
  try {
    const { empresaId, fecha } = req.query;

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.json([]);
    }

    const [year, month, day] = fecha.split('-');
    const date = new Date(year, month -1, day);
    const diaSemana = date.getDay();

    const dia = empresa.diasHabiles.find(
      d => d.diaSemana === diaSemana
    );

    if (!dia || !dia.habilitado) {
      return res.json([]);
    }

    const slots = generarSlots(
      dia.rangos,
      empresa.duracionTurno
    );

    const turnosTomados = await Turno.find({
      empresaId,
      fecha
    });

    const ocupados = turnosTomados.map(t => t.hora);

    
    const disponibles = []
    slots.forEach(s=>{
      if(ocupados.includes(s)){
        d = {hor: s, disp: true}
      }else{
        d = {hor: s, disp: false}
      }
      disponibles.push(d)
    })
    
    res.json(disponibles);

  } catch (error) {
    res.status(500).json({ 
      mensaje: "Error al obtener turnos disponibles",
      error
    });
  }
};

////////////////////////////
const horaEnRangos = (hora, rangos) => {
  const [h, m] = hora.split(':').map(Number);
  const minutosHora = h * 60 + m;

  return rangos.some(r => {
    const [dh, dm] = r.desde.split(':').map(Number);
    const [hh, hm] = r.hasta.split(':').map(Number);

    const desde = dh * 60 + dm;
    const hasta = hh * 60 + hm;

    return minutosHora >= desde && minutosHora < hasta;
  });
};
////////////////////////////

const crearTurno = async (req, res) => {
  
  try {
    const {
      empresaId,
      fecha,
      hora,
      nombre,
      telefono,
      email,
      notas
    } = req.body;

    if (!empresaId || !fecha || !hora || !nombre || !telefono) {
      return res.json({
        error: true,
        mensaje: 'Datos incompletos'
      });
    }

    const empresa = await Empresa.findById(empresaId);
    if (!empresa) {
      return res.json({
        error: true,
        mensaje: 'Empresa no encontrada'
      });
    }

    const date = new Date(fecha);
    const diaSemana = date.getDay()+1;

    const dia = empresa.diasHabiles.find(
      d => d.diaSemana === diaSemana
    );


    if (!dia || !dia.habilitado) {
      return res.json({
        error: true,
        mensaje: 'Día no disponible'
      });
    }

    if (!horaEnRangos(hora, dia.rangos)) {
      return res.json({
        error: true,
        mensaje: 'Horario inválido'
      });
    }

    const ocupado = await Turno.findOne({
      empresaId,
      fecha,
      hora,
      estado: { $in: ['pendiente', 'confirmado'] }
    });

    if (ocupado) {
      return res.json({
        error: true,
        mensaje: 'Horario ya reservado'
      });
    }

    const turno = await Turno.create({
      empresaId,
      fecha,
      hora,
      nombre,
      telefono,
      email,
      notas,
      estado: 'confirmado'
    });

    await Cliente.findOneAndUpdate({telefono, empresaId},
      {
        $set:{
          ultimaVisita: new Date(fecha)
        },
        $setOnInsert:{
          nombre,
          email,
          telefono,
          empresaId,
          creadoEn: new Date(fecha)
        }
      },
      {
        upsert: true,
        new: true
      }
    )

    res.json({
      mensaje: 'Turno creado',
      turno
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.json({
        mensaje: 'Horario ya reservado',
        error
      });
    }

    res.status(500).json({
      mensaje: 'Error al crear turno',
      error
    });
  }
};



const obtenerTurnoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const turno = await Turno.findById(id);
    if (!turno) {
      return res.json({ 
        error: true,
        mensaje: 'Turno no encontrado' 
      });
    }

    const empresa = await Empresa.findById(turno.empresaId);

    res.json({
      _id: turno._id,
      fecha: turno.fecha,
      hora: turno.hora,
      nombre: turno.nombre,
      telefono: turno.telefono,
      estado: turno.estado,
      empresaNombre: empresa?.name || ''
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      mensaje: 'Error obteniendo turno',
      error 
    });
  }
};



module.exports = {turnosDisponibles, crearTurno, obtenerTurnoPorId};

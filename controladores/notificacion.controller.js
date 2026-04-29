const Notificacion = require('../modelos/Notificación')


const obtenerNotificaciones = async (req, res) => {
  const notificaciones = await Notificacion.find({
    empresaId: req.params.empresaId
  }).sort({ fecha: -1 });

  res.json(notificaciones);
};

const marcarLeida = async (req, res) => {
  await Notificacion.findByIdAndUpdate(req.params.id, {
    leida: true
  });

  res.json({ ok: true });
}

module.exports = { obtenerNotificaciones, marcarLeida }
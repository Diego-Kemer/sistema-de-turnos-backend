const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  empresaId: String,
  titulo: String,
  mensaje: String,
  leida: {
    type: Boolean,
    default: false
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);
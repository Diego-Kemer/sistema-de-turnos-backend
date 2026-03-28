const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    telefono: String,
    email: String,
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    ultimaVisita: String,
    creadoEn: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cliente', clienteSchema);
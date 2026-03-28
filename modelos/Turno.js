const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema(
  {
    empresaId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    fecha: {
      type: String, // "2026-01-27"
      required: true
    },
    hora: {
      type: String, // "10:30"
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmado', 'cancelado'],
      default: 'pendiente'
    },
    observaciones: String
  },
  { timestamps: true }
);
turnoSchema.index(
  { empresaId: 1, fecha: 1, hora: 1 },
  { unique: true,
    partialFilterExpression: {
      estado: { $in: ['pendiente', 'confirmado'] }
    }
   }
);

module.exports = mongoose.model('Turno', turnoSchema);

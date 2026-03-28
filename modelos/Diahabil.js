const mongoose = require('mongoose');
const {RangoHorarioSchema} = require('./RangoHorario')

const diaHabilSchema = new mongoose.Schema(
  {
    diaSemana: {
      type: Number,
      min: 0, // domingo
      max: 6  // sábado
    },
    habilitado: {
      type: Boolean,
      default: true
    },
     rangos: {
        type: [RangoHorarioSchema]
    }
  },
  { timestamps: true }
);

module.exports = {diaHabilSchema} ;
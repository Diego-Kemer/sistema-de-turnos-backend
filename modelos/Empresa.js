const mongoose = require('mongoose');
const {diaHabilSchema} = require('./Diahabil')



const EmpresaSchema = new mongoose.Schema({
  name: String,
  descripcion: { type: String, default: "" },
  colorTema: { type: String, default: "#4f46e5" },
  slug: { type: String, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  diasHabiles: {
    type: [diaHabilSchema],
    default: () =>
        Array.from({ length: 7 }, (_, i) => ({
          diaSemana: i,
          habilitado: !(i === 0 || i === 6),
          rangos: [
            { desde: "09:00", hasta: "12:00" },
            { desde: "15:00", hasta: "18:00" }
          ]
        }))
  },

  duracionTurno: {
    type: Number, // minutos
    default: 30
  },

  activa: {type: Boolean, default: true}
},
{ timestamps: true });

module.exports = mongoose.model('Business', EmpresaSchema);

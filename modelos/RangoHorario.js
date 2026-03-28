const mongoose = require('mongoose');

const RangoHorarioSchema = new mongoose.Schema({
  desde: {
    type: String, // "09:00"
    required: true
  },
  hasta: {
    type: String, // "13:00"
    required: true
  }
},
{_id: true}
);

module.exports = {RangoHorarioSchema};
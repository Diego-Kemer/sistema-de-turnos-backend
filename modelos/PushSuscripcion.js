const mongoose = require('mongoose');

const PushSchema = new mongoose.Schema({
  empresaId: String,
  subscription: Object
});

module.exports = mongoose.model('Push', PushSchema);
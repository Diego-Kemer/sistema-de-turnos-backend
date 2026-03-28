require('dotenv').config();
const express = require('express');
const auth = require('./rutas/auth');
const empresas = require('./rutas/empresa')
const diasHoarios = require('./rutas/dias-horarios');
const turnos = require('./rutas/turnos')
const clientes = require('./rutas/clientes')
const connectDB = require('./configuraciones/db');
const cors = require('cors');


const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
connectDB();

// Rutas básicas
// app.get('/', (req, res) => {
//     res.json({ mensaje: 'Servidor funcionando' });
// });
app.use('/', auth);
app.use('/api', empresas);
app.use('/api', turnos);
app.use('/editDH', diasHoarios);
app.use('/clientes', clientes)

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const auth = require('./rutas/auth');
const empresas = require('./rutas/empresa')
const diasHoarios = require('./rutas/dias-horarios');
const turnos = require('./rutas/turnos')
const clientes = require('./rutas/clientes')
const notificaciones = require('./rutas/notificaciones')
const connectDB = require('./configuraciones/db');
const cors = require('cors');
const pushSuscripcion = require('./rutas/pushSuscripcion')
const webpush = require('web-push');


const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas
connectDB();

webpush.setVapidDetails(
  'mailto:diegokemer26@gmail.com',
  process.env.VAPID_PUBLIC,
  process.env.VAPID_PRIVATE
);

app.use('/api/auth', auth);
app.use('/api/empresa', empresas);
app.use('/api/turnos', turnos);
app.use('/api/dias-horarios', diasHoarios);
app.use('/api/clientes', clientes)
app.use('/api', pushSuscripcion)
app.use('/api/notificaciones', notificaciones)

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

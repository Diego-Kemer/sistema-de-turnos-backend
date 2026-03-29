const router = require('express').Router()
const {turnosDisponibles, crearTurno, obtenerTurnoPorId} = require('../controladores/turnos-controller')
const {generarComprobante} = require('../controladores/downloadPdf-controller')
const {obtenerTurnosPorEmpresa} = require('../controladores/turnos-by-empresa');

router.get('/:empresaId', obtenerTurnosPorEmpresa);
router.get('/disponibles', turnosDisponibles);
router.post('/turno', crearTurno);
router.get('/turno/:id', obtenerTurnoPorId);
router.get('/turno/:id/comprobante', generarComprobante);

module.exports = router;
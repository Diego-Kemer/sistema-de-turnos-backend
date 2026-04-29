const router = require('express').Router();
const { obtenerNotificaciones, marcarLeida } =  require('../controladores/notificacion.controller')

router.get('/:empresaId', obtenerNotificaciones);

router.put('/:id', marcarLeida);

module.exports = router;
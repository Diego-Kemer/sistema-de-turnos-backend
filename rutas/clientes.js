const router = require('express').Router()
const {getClientes} = require('../controladores/clientes.controller')

router.get('/:empresaId', getClientes)

module.exports = router
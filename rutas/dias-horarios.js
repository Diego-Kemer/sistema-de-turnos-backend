const express = require('express')
const router = express.Router();
const auth = require('../midlleware/JWT');
const {diasHabiles, agregarRango, eliminarRango} = require('../controladores/dias-horarios-controller')

router.put('/diasHabiles/:id', auth, diasHabiles)

router.post('/rangoNew/:id', auth, agregarRango)

router.delete('/deleteRango/:id/:diaSemana/:rangoId', auth, eliminarRango)



module.exports = router;
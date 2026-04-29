const router = require('express').Router();
const { guardarSuscripcion, enviarPushPorEmpresa} = require('../controladores/push-notificacion.controller')

router.post('/push/suscribe/:empresaId', guardarSuscripcion)

router.get('/test-push/:empresaId', async (req, res) => {
  console.log('🚀 TEST PUSH');
  const {empresaId} = req.params;

  await enviarPushPorEmpresa(empresaId);

  res.json({ ok: true });
});

module.exports = router;
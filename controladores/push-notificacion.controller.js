const Push = require('../modelos/PushSuscripcion');
const webpush = require('web-push')

const guardarSuscripcion = async (req, res) => {
  const { empresaId } = req.params;
  const { subscription } = req.body;

  await Push.findOneAndUpdate(
    { empresaId },
    { subscription },
    { upsert: true }
  );

  res.json({ok: true});
}

const enviarPushPorEmpresa = async (empresaId, turno) => {
  
  const registros = await Push.find({ empresaId });

  console.log('📦 Subs encontradas:', registros.length);

  const payload = JSON.stringify({
    title: 'Nuevo turno',
    body: `${turno.nombre} reservó a las ${turno.hora} del ${turno.fecha}`,
    data: {
      url: '/panel/turnos'
    }
  });

  for (const r of registros) {
    try {
      console.log('📡 Enviando push...');
      await webpush.sendNotification(r.subscription, payload);
      console.log(' push send');
    } catch (e) {
      console.error('Error push:', e);
    }
  }
}


module.exports = { guardarSuscripcion, enviarPushPorEmpresa }
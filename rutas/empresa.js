const router = require('express').Router();
const auth = require('../midlleware/JWT');
const {me, public }= require('../controladores/me-controller');

router.get('/me/:id', auth, me);

router.get('/public/:slug', public);

module.exports = router;
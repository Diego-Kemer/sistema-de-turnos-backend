const User = require('../modelos/User');
const Business = require('../modelos/Empresa');

const me = async (req, res) => {
  const user = await User.findById(req.params.id);
  const empresa = await Business.findOne({owner: user._id});

  res.json({
    user,
    empresa
  });
};

const public = async (req, res) => {
  const emp = await Business.findOne({ slug: req.params.slug });
  if (!emp) return res.status(404).json({ msg: 'Not found' });

  res.json({
    emp
  });
}

module.exports = {me, public}

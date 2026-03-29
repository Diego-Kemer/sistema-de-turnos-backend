const User = require('../modelos/User');
const Empresa = require('../modelos/Empresa');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { nombre, email, password, businessName, avatar } = req.body;
  if (!nombre || !email || !password || !businessName) {
    return res.json({ 
      error: true,
      mensaje: 'Datos incompletos' 
    });
  }
  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.json({ 
        error: true,
        message: 'El email ya está registrado' 
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      nombre,
      email,
      password: hashedPassword,
      businessName,
      avatar
    });
    
    const slug = businessName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");


    const empresa = new Empresa({
      name: businessName,
      owner: user._id,
      slug
    })
 

  await empresa.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ 
      token, 
      empresa,
      mensaje: "El usuario se registró de forma correcta"
    });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Server error', 
      error 
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        error: true,
        mensaje: 'El email ingresado no está registrado' 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ 
        error: true,
        mensaje: 'La contraseña ingresada es incorrecta' 
      });
    }

    const empresa = await Empresa.findOne({owner: user._id})

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ 
      token, 
      empresa,
      mensaje: 'Acceso correcto'
     });
  } catch (error) {
    res.status(500).json({ 
      mensaje: 'Error',
      error
    });
  }
};

module.exports = {register, login}

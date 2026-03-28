const Empresas = require('../modelos/Empresa')

const diasHabiles = async (req, res)=>{
    //Recibe un array de objetos, cada objeto va a contener un numero (correspondiente a un día) y un boolean correspondiente a habil o no
    try {
        const {id} = req.params;
        const dias = req.body;
        const empresa = await Empresas.findOne({_id: id})

        if (!empresa) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        dias.forEach(dia => {
            let diaEmpresa = empresa.diasHabiles.find(
                d => d.diaSemana === dia.diaSemana
            );

            if(diaEmpresa){
                diaEmpresa.habilitado = dia.habilitado
            }
        });
        
        const empresaActualizada = await Empresas.updateOne(
            { _id: id },
            { $set: { diasHabiles: empresa.diasHabiles } }
        );

        res.json({
            mensaje: "Días hábiles actualizados",
            diasHabiles: empresa.diasHabiles
        })
    } catch (error) {
        res.json({ 
            message: 'Error al actualizar días hábiles',
            error
         });
    }
}

//Agregar rango a un día especifico
const agregarRango = async (req, res) => {
  try {
    const { id } = req.params;
    const { desde, hasta, diaSemana } = req.body;

    if (!desde || !hasta) {
      return res.json({ 
        mensaje: 'Rango incompleto',
        error: true 
    });
    }

    if (desde >= hasta) {
      return res.json({ 
        mensaje: 'El rango es inválido',
        error: true 
    });
    }

    const empresa = await Empresas.findById(id);
    if (!empresa) {
      return res.json({ 
        message: 'Empresa no encontrada',
        error: true
    });
    }

    const dia = empresa.diasHabiles.find(
      d => d.diaSemana === Number(diaSemana)
    );

    if (!dia) {
      return res.json({ 
        mensaje: 'Día no encontrado',
        error: true
    });
    }

    const empresaActualizada = await Empresas.findOneAndUpdate(
      { _id: id, 'diasHabiles.diaSemana': Number(diaSemana) },
      {
        $push: {
          'diasHabiles.$.rangos': { desde, hasta }
        }
      },
      { new: true }
    );

    res.json({
      mensaje: 'Rango agregado',
      emp: empresaActualizada
    });

  } catch (error) {
    res.json({ 
        mensaje: 'Error al agregar rango',
        error
     });
  }
};

const eliminarRango = async (req, res) => {
  try {
    const { id, diaSemana, rangoId} = req.params;

    const empresa = await Empresas.findById(id);
    if (!empresa) {
      return res.json({ 
        mensaje: 'Empresa no encontrada',
        error: true
    });
    }

    const dia = empresa.diasHabiles.find(
      d => d.diaSemana === Number(diaSemana)
    );

    if (!dia) {
      return res.json({ 
        mensaje: 'Día no encontrado',
        error: true 
    });
    }

    // if (!dia.rangos.rangoId) {
    //   return res.json({ 
    //     mensaje: 'Rango inexistente', 
    //     error: true 
    // });
    // }

    await Empresas.findOneAndUpdate(
      { _id: id, 'diasHabiles.diaSemana': Number(diaSemana) },
      {
        $pull: {
          'diasHabiles.$.rangos': { _id: rangoId }
        }
      },
      { new: true }
    );

    const empresaActualizada = await Empresas.findOne({_id: id});

    res.json({
      mensaje: 'Rango eliminado',
      emp: empresaActualizada
    });

  } catch (error) {
    res.json({ 
        mensaje: 'Error al eliminar rango',
        error: true 
    });
  }
};

module.exports = {diasHabiles, agregarRango, eliminarRango}

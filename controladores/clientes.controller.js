const Clientes = require('../modelos/Cliente')

getClientes = async (req, res)=>{
    try{
        const {empresaId} = req.params
    
        const clientes = await Clientes.find({empresaId}) 

        if(!clientes){
            return res.json({mensaje: "Aún no tienes clientes"})
        }
        res.json({
            error: false,
            mensaje: "La slicitud se resolvió de forma exitosa",
            clientes
        })
    }catch (error) {
    res.status(500).json({ error });
  }

}

module.exports = {getClientes}
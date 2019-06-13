
const jwt = require('jsonwebtoken')

/* VERIFICAR TOKEN */

let verificacionToken = (req, res, next) => {

    let token = req.get('token')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if(err){
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario
        next()
    })

   /*  res.json({
        token
    }) */
}

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario

    console.log(usuario);
    

    if(usuario.role === 'ADMIN_ROLE'){

        next()

    }else {
        res.json({
                ok: false,
                err: {
                    message: 'Usuario no es Administrador'
                }
            })
    }

    
}


module.exports = {
    verificacionToken,
    verificaAdmin_Role
}
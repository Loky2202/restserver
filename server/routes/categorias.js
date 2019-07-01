const express = require('express')


let { verificacionToken, verificaAdmin_Role } = require('../middlewares/autenticacion')

let app =  express()

let Categoria = require('../models/categoria')

//Mostrar todas las categorias
app.get('/categoria', verificacionToken, (req, res) => {

    Categoria.find({})
                    .sort('descripcion')
                    .populate('usuario', 'nombre email')
                    .exec((err, categorias) => {
                        if(err) return res.status(500).json({ok: false, err})

                        res.json({
                            ok: true,
                            categorias
                        })
                    })
})

//Mostrar una categoria
app.get('/categoria/:id', verificacionToken, (req, res) => {

    Categoria.findById({ _id: req.params.id })
                        .populate('usuario', 'nombre email')
                        .exec((err, categoriaDB) => {
                            if(err) return res.status(400).json({ok: false, err})
                            if(!categoriaDB) return res.status(500).json({ok: false, err: {message: 'No se encontro categoria'}})
                            res.json({
                                ok: true, 
                                categoriaDB
                            })
                        })
})

//Crear nueva categoria
app.post('/categoria', [verificacionToken, verificaAdmin_Role], (req, res) =>{
    //regresa la nueva categoria
    //req.usuario._id

    let id = req.usuario._id

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: id
    })

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if(!categoriaDB) return res.status(500).json({ok: false, err})

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
})

//Actualizar la categoria
app.put('/categoria/:id', [verificacionToken, verificaAdmin_Role], (req, res) => {

    let idCategoria = req.params.id
    let body = req.body

    let descCategoria = {
        descripcion: body.descripcion
    }
    
    Categoria.findByIdAndUpdate(idCategoria, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})

//Eliminar categoria por admin
app.delete('/categoria/:id', [verificacionToken, verificacionToken], (req, res) => {
    
    let id = req.params.id

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {

        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encotrada'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoria borrada'
        })
    })
})

module.exports = app
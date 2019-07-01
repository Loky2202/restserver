

const express = require('express')
const { verificacionToken } = require('../middlewares/autenticacion')
const _ = require('underscore')

let app = express()
let Producto = require('../models/producto')

//Obtener productos todo los productos
app.get('/productos', verificacionToken, (req, res) => {
    /* traer todo los productos
    populate: usuario categoria
    paginando */
    let desde = Number(req.query.desde || 0)
    Producto.find({ disponible: true })
                                    .sort('nombre')
                                    .populate('usuario', 'email')
                                    .populate('categoria', 'descripcion')
                                    .skip(desde)
                                    .limit(5)
                                    .exec((err, productos) => {
                                        if(err) return res.status(500).json({ ok: false, err })

                                        Producto.countDocuments({ disponible: true }, (err, conteo) => {
                                            
                                            if(err) return res.status(500).json({ ok: false, err: { message: 'No se pudo obtener el conteo' } })
                                            
                                            res.json({
                                                ok: true,
                                                productos,
                                                conteo
                                            })
                                        })
                                        
                                    })

})

/* Devuelve un producto */
app.get('/productos/:id', verificacionToken, (req, res) => {
    /* Populate de usuario y categoria
    paginado */
    let id = req.params.id

    Producto.findById({ _id: id })
                            .populate('categoria', 'nombre')
                            .populate('usuario', 'nombre email')
                            .exec((err, producto) => {
                                if (err) return res.status(500).json({ ok: false })
                                if (!producto) return res.status(400).json({ ok: false, err: { message: 'El ID no fue encontrado' } })
                                res.json({
                                    ok: true,
                                    producto
                                })
                            })
})

/* Buscar productos */
app.get('/productos/buscar/:termino', verificacionToken, (req, res) => {

    let termino = req.params.termino

    let regex = new RegExp(termino, 'i') //paso una i para que sea insensible a mayusculas y minisculas

    Producto.find({ nombre: regex })
                    .populate('categoria', 'nombre')
                    .exec((err, productos) => {
                        if (err) return res.status(500).json({ ok: false, err }) 

                        res.json({
                            ok: true,
                            productos
                        })
                    })
})
/* Crear un nuevo producto */
app.post('/productos', verificacionToken, (req, res) =>{
    /* Grabar el usuario
    Grabar una categoria del listado */
    idUsuario = req.usuario._id
    idCategoria = req.body.idCategoria
    nombre = req.body.nombre
    precioUni = req.body.precioUni
    descripcion = req.body.descripcion

    let producto = new Producto({
        nombre: nombre,
        precioUni: precioUni,
        descripcion,
        categoria: idCategoria,
        usuario: idUsuario
    }) 

    producto.save((err, productoDB) => {
        if(err) return res.status(500).json({ ok: false, err} )

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto guardado'
        })
    })
    
})

/* Actualiza un producto */ 
app.put('/productos/:id', verificacionToken, (req, res) => {
    /* Grabar el usuario
    Grabar una categoria */
    let id = req.params.id
    let body= {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria, 
        usuario: req.usuario._id
    }    

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if(err) return res.status(500).json({ ok:false, err })
         
        res.json({
            ok: true,
            producto: productoDB,
            message: `Producto actualizado`
        })
    })
})

/* Cambie el estado del producto */
app.delete('/productos/:id', verificacionToken, (req, res) => {
    /* cambiar el estado del producto */
    let id = req.params.id

    let cambiarEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true }, (err, productoDB) => {

        if(err) return res.status(400).json({ ok: false, err })

        if(!productoDB) return res.status(400).json({ ok: false, err: { message: 'Producto no encotra' } })

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto ya no esta disponible'
        })
    })
})


module.exports = app
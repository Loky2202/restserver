require('./config')

const express = require('express')
const mongoose = require('mongoose')
const colors = require('colors')
const path = require('path')

colors.setTheme({
    ready: ['yellow', 'bold', 'bgGreen'],
    error:['white', 'italic', 'bgRed']
  });


const app = express()

const bodyParser = require('body-parser')

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())

//Habilitar la carpeta public
app.use( express.static( path.resolve( __dirname, '../public' ) ) )

//Configuracion globar de rutas
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB,
                { useNewUrlParser: true, useCreateIndex: true },
                (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE'.ready);

});

app.listen(process.env.PORT, () => {
    console.log(`Escuchado en el puerto ${ process.env.PORT }`.ready)
})
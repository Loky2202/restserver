require('./config')

const express = require('express')

const app = express()

const bodyParser = require('body-parser')

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// Parse application/json
app.use(bodyParser.json())


app.get('/usuario', (req, res) => {
    res.json(`get usuario`)
})

app.post('/usuario', (req, res) => {

    let body = req.body

    res.json({
        persona: body
    })
})

app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    res.json({
        id
    })
})

app.delete('/usuario', (req, res) => {
    res.json(`delete usuario`)
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchado en el puerto ${ process.env.PORT }`)
})
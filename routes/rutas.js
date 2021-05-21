const express = require('express')
// const app = express()
const router = express.Router()
const Clientesdb = require('../models/modelo')

// Get all
router.get('/clientes', (req, res) => {
    try {
        Clientesdb.find({}, (err, results) => {
            res.render('clientes', {
                clientesList: results
            })
        })
    } catch (error) {
        res.status(500).send(json({
            message: error.message
        }))
    }
})

// Get one
// router.get('/cliente/:id', (req, res) => {
//     try {
//         Clientesdb.find({
//             id: req.params.id
//         }, function (err, results) {
//             if (err) throw err;
//             res.render('clientes', {
//                 clientesList: results
//             })
//         })
//     } catch (error) {
//         res.status(500).send(json({
//             message: error.message
//         }))
//     }
// })

// create
// render form
router.get('/addCliente', (req, res) => {
    res.render('form')
})

// save cliente
router.post('/addCliente', (req, res) => {
    Clientesdb.find({
        email: req.body.email
    }, (err, results) => {
        if (results.length > 0) {
            res.send('El cliente existe')
        } else {
            try {
                const newCliente = new Clientesdb({
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone
                })
                newCliente.save()
                res.render('form')
            } catch (error) {
                res.status(500).send(json({
                    message: error.message
                }))
            }
        }
    })
})

// update one
router.post('/upCliente', async (req, res) => {
    try {
        Clientesdb.findOneAndUpdate({email: req.body.emailform}, {name: req.body.nameform}, (err, result) => {
            if (err) throw err
            else {
                res.send('Cliente actualizado correcatamente <br> <div style="text-align: center;"><h2>Volver a el form</h2><form action="/clientes" method="get"><button class="btn btn-primary" type="submit">← Volver</button></form></div>')
            }
        })
    } catch (error) {
        console.log(error.message);
    }
})

// delete one
router.get('/delCliente/:id', getCliente, (req, res) => {
    try {
        var removeById = function (personId) {
            Clientesdb.findByIdAndDelete(personId, (err, deletedCliente) => {
                if (err) throw err
                else {
                    deletedCliente.remove()
                }
            })
        }
        removeById(res.cliente.id)
        res.send('cliente eliminado')
    } catch (error) {
        res.status(500).send(json({
            message: error.message
        }))
    }
})

async function getCliente(req, res, next) {
    let cliente
    try {
        cliente = await Clientesdb.findById(req.params.id)
        if (cliente == null) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            })
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }

    res.cliente = cliente
    next()
}


module.exports = router
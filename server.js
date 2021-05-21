if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', (err) => console.log(err))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));
app.set('view engine', 'ejs')
app.use(express.static("public"));

const rutasClientes = require('./routes/rutas')
app.use('/', rutasClientes)

app.get('/', (req, res) => {
    res.render('form')
})

app.listen(3000, () => console.log('Server Started!'))
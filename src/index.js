import express from 'express'
import { config } from 'dotenv'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import prodRoutes from './routes/products.routes.js'

config()



const app = express()

app.use(bodyParser.json())


mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })

const db = mongoose.connection

app.use('/products', prodRoutes)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Servidor en puerto ${port}`);

})
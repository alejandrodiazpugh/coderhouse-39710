//@ts-check

// --------------------------- IMPORTS ---------------------------

import express from 'express'
import ProductManager from './ProductManager.js'
// --------------------------- INSTANCIA Y VARIABLES ---------------------------

const app = express()

const productos = new ProductManager('./src/data/products.txt')
const PORT = process.env.PORT || 8080

// --------------------------- RUTAS ---------------------------

app.get('/products', async (req, res) => {
    const limit = req.query.limit
    const products = await productos.getProducts()
    if (!limit) {
        res.status(200).send(products)
        return
    }
    const limitedProducts = products.slice(0, limit)
    res.status(200).send(limitedProducts)
})

app.get('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    if (isNaN(id)) {
        res.status(400).send('Bad Request, id is not a number')
        return
    }
    res.status(200).send(await productos.getProductById(id))
})

// --------------------------- SERVIDOR ---------------------------
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`)
})

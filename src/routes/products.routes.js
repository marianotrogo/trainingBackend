import express from 'express'
import { Router } from "express"
import Product from '../models/products.model.js'


const router = Router()

//Middleware 
const getProd = async (req, res, next) => {
    let prod;
    const { id } = req.params;

    //.match(/^[0-9a-fa-F]{24}$/)

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'el id no valido'
            }
        )
    }
    try {
        prod = await Product.findById(id)
        if (!prod) {
            return res.status(404).json({ message: 'el producto no fue encontrado' })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    res.prod = prod
    next()
}


router.get('/', async (req, res) => {
    try {
        const products = await Product.find()
        console.log('Get All', products);

        if (products.length === 0) {
            return res.status(204).json([])
        }
        res.json(products)

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.get('/:id', getProd, async (req, res) => {
    res.json(res.prod)
})

router.put('/:id', getProd, async(req,res)=>{
    try {
        const prod = res.prod
        prod.title = req.body.title || prod.title;
        prod.price = req.body.price || prod.price

        const updatedProd = await prod.save()

        res.json(updatedProd)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
        
    }
})

router.patch('/:id', getProd, async(req,res)=>{

    if(!req.body.title && !req.body.price){
        res.status(400).json({message: "falto algun campo"})
    }

    try {
        const prod = res.prod
        prod.title = req.body.title || prod.title;
        prod.price = req.body.price || prod.price

        const updatedProd = await prod.save()

        res.json(updatedProd)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
        
    }
})

router.post('/', async (req, res) => {
    const { title, price } = req.body
    if (!title || !price) {
        return res.status(400).json({ message: "los Campos deben estar completos" })
    }

    const products = new Product(
        {
            title,
            price
        }
    )
    try {
        const newProduct = await products.save()
        console.log(newProduct);

        res.status(201).json(newProduct)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

router.delete('/:id', getProd, async(req,res)=>{
    try {
        const prod = res.prod
        await res.prod.deleteOne({
            _id: prod._id
        })
        res.json({
            message: 'Producto eliminado con exito'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


export default router
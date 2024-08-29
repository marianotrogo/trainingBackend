import mongoose from "mongoose";


const productsSchema = new mongoose.Schema(
    {
        title:String,
        price: Number
    }
)

const Product = mongoose.model('Product', productsSchema)

export default Product
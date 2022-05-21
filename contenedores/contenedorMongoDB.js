import productSchema from '../models/productos.js'
import carritoSchema from '../models/carritos.js'


class contenedorMongoDB{
    constructor(){
    }

    listAll(res){
        productSchema
            .find()
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }
    
    listById(res,id){
        productSchema
            .find({ _id: id })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }
    create(req, res) {
        const producto = productSchema(req.body)
        producto.save().then(data => res.json(data)).catch(error => res.json({ messaje: error }))
    }

    updateById(req, res, id) {
        productSchema
            .updateOne({ _id: id }, {
                $set: { title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail, stock: req.body.stock }
            })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }

    deleteById(req, res, id) {
        productSchema
            .deleteOne({ _id: id })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }

    //Carrito
    listAllCarrito(res){
        carritoSchema
            .find()
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }
    
    listByIdCarrito(res,id){
        carritoSchema
            .find({ _id: id })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }

    createCarrito(req, res, user) {
        const carrito = carritoSchema({date: new Date,productos:[],user: user})
        carrito.save().then(data => res.json(data)).catch(error => res.json({ messaje: error }))
    }

    async agregarProdCarrito(req, res, id_carrito, id_producto) {
        let producto = await productSchema.find({_id: id_producto}).then(()=>true).catch(()=>false);
        if (producto){
        let array = await carritoSchema.find({_id: id_carrito},{"productos":1,"_id":0})
        array[0].productos.push(id_producto)
        carritoSchema
            .updateOne({ _id: id_carrito }, {
                $set: { productos: array[0].productos}
            })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
        }else{
            res.send({mensaje: "El producto no existe"})
        }
    }

    async borraProdCarrito(req, res, id_carrito, id_producto) {
        let array = await carritoSchema.find({ _id: id_carrito }, { "productos": 1, "_id": 0 })
        let index = array[0].productos.indexOf(id_producto)
        if (array[0].productos.includes(id_producto)){
            array[0].productos.splice(index, 1)
        }
        carritoSchema
            .updateOne({ _id: id_carrito }, {
                $set: { productos: array[0].productos }
            })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }

    async cantidadProdCarrito(req, res, id_carrito, id_producto) {
        let array = await carritoSchema.find({ _id: id_carrito }, { "productos": 1, "_id": 0 })
        if (array[0].productos.includes(id_producto)){
           let filtrada = array[0].productos.filter(elem => elem == id_producto)
           res.json({cantidad: filtrada.length }) 
        }else{
            res.json({cantidad: 0})
        }
    }

    deleteByIdCarrito(req, res, id) {
        carritoSchema
            .deleteOne({ _id: id })
            .then(data => res.json(data))
            .catch(error => res.json({ messaje: error }))
    }

}

export default contenedorMongoDB
   

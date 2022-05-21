import db from '../config.js'
const query = db.collection('productos');
const queryCarritos = db.collection('carritos');

class contenedorFirebase{
    constructor(){
    }
    async listAll(res) {
        try {
            const querySnapshot = await query.get()
            let docs = querySnapshot.docs
            const response = docs.map((doc) => ({
                title: doc.data().title,
                price: doc.data().price,
                thumbnail: doc.data().thumbnail,
                stock: doc.data().stock,
                id: doc.data().id,
            }));
            res.json(response);
        } catch (error) { console.log(error) }
    }
    
    async listById(res, id) {
        const doc = query.doc(id)
        const item = await doc.get()
        const response = item.data()
        res.json(response)
    }


    async create(req, res) {
        const doc = query.doc();
        await doc.create({title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail, stock: req.body.stock, id: doc.id})
        res.json(doc)
    }

    async updateById(req, res, id) {
        const doc = query.doc(id);
        await doc.update({title: req.body.title, price: req.body.price, thumbnail: req.body.thumbnail, stock: req.body.stock})
        res.json(doc)
        
    }

    async deleteById(req, res, id) {
        const doc = query.doc(id);
        await doc.delete()
        res.json(doc)
    }

    //Carrito
    async createCarrito(req, res) {
        const doc = queryCarritos.doc();
        await doc.create({ date: new Date, productos:[], id: doc.id});
        res.json(doc);
    }

    async listAllCarrito(res) {
        try {
            const querySnapshot = await queryCarritos.get()
            let docs = querySnapshot.docs
            const response = docs.map((doc) => ({
                id: doc.data().id,
                date: doc.data().date,
                productos: doc.data().productos
            }));
            res.json(response);
        } catch (error) { console.log(error) }
    }

    async listByIdCarrito(res, id) {
        const doc = queryCarritos.doc(id)
        const item = await doc.get()
        const response = item.data()
        res.json(response)
    }

    async agregarProdCarrito(req, res, id_carrito, id_producto) {
        const docProd = query.doc(id_producto)
        const itemProd = await docProd.get()
        const responseProd = itemProd.data()
        if ((responseProd !== undefined)){
            const doc = queryCarritos.doc(id_carrito)
            const item = await doc.get()
            const response = item.data()
            response.productos.push(id_producto)
            await doc.update({productos: response.productos})
            res.json(response.productos)
       }else{
            res.json({mensaje: "No se puede agregar un producto que no existe"})
        }     
    }

    async borraProdCarrito(req, res, id_carrito, id_producto) {
        const doc = queryCarritos.doc(id_carrito)
        const item = await doc.get()
        const response = item.data()
        //console.log(response.productos.includes(11))
        if ((response.productos).includes(id_producto)){
            let index = response.productos.indexOf(parseInt(id_producto))
            response.productos.splice(index, 1)
            await doc.update({productos: response.productos})
        }
        res.json(response.productos)
        
    }

    async cantidadProdCarrito(req, res, id_carrito, id_producto) {
        const doc = queryCarritos.doc(id_carrito)
        const item = await doc.get()
        const response = item.data()
        if ((response.productos).includes(id_producto)) {
            let filtrada = response.productos.filter(elem => elem == id_producto)
            res.json({ cantidad: filtrada.length })
        } else {
            res.json({ cantidad: 0 })
        }
    }

    async deleteByIdCarrito(req, res, id) {
        const doc = queryCarritos.doc(id);
        await doc.delete()
        res.json(doc)
    }

}

export default contenedorFirebase;

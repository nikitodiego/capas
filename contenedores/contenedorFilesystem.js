import fs from 'fs'

class contenedorFilesystem{
    constructor() {
    }
    
    async listAll(res){
        try{
            const leer = await fs.promises.readFile('./archivos/productos.json',"utf-8");
            res.json(JSON.parse(leer));
        }
        catch(err){
            console.log("Error de lectura",err)
        }
    }

    async listById(res,id) {
        let array = [];
        try {
            const leer = await fs.promises.readFile('./archivos/productos.json', "utf-8");
            if (leer == "") {
                console.log("archivo vacío")
            } else {
                array = JSON.parse(leer);
                for (let n of array) {
                    if (n.id == id) {
                        return res.send(n);
                    }
                } return res.send({"producto": "no encontrado"});
            }
        }
        catch (err) {
            console.log("Error de lectura", err)
        }
    }

    async create(req,res){
        let array = [];
        try{
            const leer = await fs.promises.readFile('./archivos/productos.json',"utf-8");
            if (leer == ""|| leer =="[]"){
                array.push(req.body);
                req.body.id = array.length;
            }else{
                array = JSON.parse(leer);
                const ids = array.map(object => object.id);
                const max = Math.max(...ids);
                array.push(req.body);
                req.body.id = max+1;
            }
        }
        catch(err){
            console.log("Error de lectura",err)
        }
            fs.writeFileSync('./archivos/productos.json',JSON.stringify(array))
            res.json({ "producto agregado": req.body });
    }

    updateById(req,res,id){
        let a = req.body;
        let b = a.title;
        let c = a.price;
        let d = a.thumbnail;
        let e = a.stock;
        const jsonData = fs.readFileSync('./archivos/productos.json');
        const data = JSON.parse(jsonData);
        for (let element of data) {
            if (element.id == id) {
                element.title = b;
                element.price = c;
                element.thumbnail = d;
                element.stock = e;
            }
        }
        fs.writeFileSync('./archivos/productos.json', (JSON.stringify(data)));
        res.json(data);
    } 

    async deleteById(req, res, id){
        let array = [];
        let a = 0;
        try{
            const leer = await fs.promises.readFile('./archivos/productos.json',"utf-8");
            array = JSON.parse(leer);
            for (let n of array){
                if (n.id == id){
                    array.splice(a,1);
                }else{
                    a+=1;
                }
            }
        }
        catch(err){
            console.log("Error de lectura",err);
        }
        const b = JSON.stringify(array);
        fs.writeFileSync('./archivos/productos.json',b);
        res.json({"producto borrado id": id})
    } 


    //Carritos
    async listAllCarrito(res){
        try{
            const leer = await fs.promises.readFile('./archivos/carritos.json',"utf-8");
            res.json(JSON.parse(leer));
        }
        catch(err){
            console.log("Error de lectura",err)
        }
    }

    async listByIdCarrito(res,id) {
        let array = [];
        try {
            const leer = await fs.promises.readFile('./archivos/carritos.json', "utf-8");
            if (leer == "") {
                console.log("archivo vacío")
            } else {
                array = JSON.parse(leer);
                for (let n of array) {
                    if (n.id == id) {
                        return res.send(n);
                    }
                } return res.send({"carrito": "no encontrado"});
            }
        }
        catch (err) {
            console.log("Error de lectura", err)
        }
    }

    async createCarrito(req,res){
        let array = [];
        let objeto = {date: new Date,productos:[]}
        try{
            const leer = await fs.promises.readFile('./archivos/carritos.json',"utf-8");
            if (leer == ""|| leer =="[]"){
                array.push(objeto);
                objeto.id = array.length;
            }else{
                array = JSON.parse(leer);
                const ids = array.map(object => object.id);
                const max = Math.max(...ids);
                array.push(objeto);
                objeto.id = max+1;
            }
        }
        catch(err){
            console.log("Error de lectura",err)
        }
        fs.writeFileSync('./archivos/carritos.json',JSON.stringify(array));
        res.json(array)
    }

    agregarProdCarrito(req, res,id_carrito,id_producto) {
        let array = [];
        const leer = fs.readFileSync('./archivos/carritos.json', "utf-8");
        array = JSON.parse(leer);
        for (let n of array) {
            if (n.id == id_carrito) {
                n.productos.push(parseInt(id_producto));
                break;
            }
        }
        const a = JSON.stringify(array);
        fs.writeFileSync('./archivos/carritos.json', a);
        res.json(array);
    }

    borraProdCarrito(req, res, id_carrito, id_producto) {
        let array = [];
        const leer = fs.readFileSync('./archivos/carritos.json', "utf-8");
        array = JSON.parse(leer);
        for (let n of array) {
            if ((n.id == id_carrito) && (n.productos.includes(parseInt(id_producto)))) {
                let index = n.productos.indexOf(parseInt(id_producto));
                n.productos.splice(index, 1);
            }
        }
        const a = JSON.stringify(array);
        fs.writeFileSync("./carrito.json", a);
        res.json(array);
    }

    cantidadProdCarrito(req, res, id_carrito, id_producto) {
        let array = [];
        const leer = fs.readFileSync('./archivos/carritos.json', "utf-8");
        array = JSON.parse(leer);
        for (let n of array) {
            if ((n.id == id_carrito) && (n.productos.includes(parseInt(id_producto)))) {
                const filtrada = n.productos.filter(elem => elem == id_producto)
                res.json({ "cantidad": filtrada.length })
                break;
            }
        } res.json({ "cantidad": 0 })
    }

    async deleteByIdCarrito(req, res, id){
        let array = [];
        let a = 0;
        try{
            const leer = await fs.promises.readFile('./archivos/carritos.json',"utf-8");
            array = JSON.parse(leer);
            for (let n of array){
                if (n.id == id){
                    array.splice(a,1);
                }else{
                    a+=1;
                }
            }
        }
        catch(err){
            console.log("Error de lectura",err);
        }
        const b = JSON.stringify(array);
        fs.writeFileSync('./archivos/carritos.json',b);
        res.json({"producto borrado id": id})
    } 

}


export default contenedorFilesystem
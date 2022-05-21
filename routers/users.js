import passport from 'passport'
import {Router} from 'express';
import Carrito from '../models/carritos.js'
import User from '../models/users.js'
import Productos from '../models/productos.js'
import carritoMongo from '../daos/carritoDaoMongoDB.js';
import multer from 'multer'
import path from 'path';
import  { createTransport } from 'nodemailer';
import twilio from 'twilio'
import winston from 'winston'

//Winston config
const logger = winston.createLogger({
  transports:[
      new winston.transports.Console({ level: 'info' }),
      new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
})

//Twilio
const accountSid = "AC75e57f85bd86c0c0e51914a8c72a5192"
const authToken = '349c683b65953a68431972f517fb8b5b'
const client = twilio(accountSid, authToken)

//Nodemailer
const transporter = createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: 'nicojapaz@gmail.com',
      pass: 'ziypjcuwoxjigczl'
  }
});

//Upload image config
const storage = multer.diskStorage({
  destination:path.join(process.cwd(),'./views/public'),
  filename:  (req, file, cb) => {
      cb(null, file.originalname);
  }
})
//Midleware para subir imagen con Multer
const uploadImage = multer({
  storage,
  limits: {fileSize: 1000000}
}).single('image');

const router = new Router();
//DAO
const carritoS = carritoMongo;

//Endpoints
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', uploadImage, passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
})); 

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile' ,isAuthenticated, async (req, res, next) => {
  const productos = await Productos.find();
  const user = await User.findOne({ _id: req.user.id })
  const carrito = await Carrito.findOne({user: req.user.id})
  if (carrito){
    res.render('profile',{ carrito: carrito, user: user, productos: productos});
  }
  else {
    res.render('carrito');
  }
});

//Crear carrito
router.post('/carrito', isAuthenticated, async (req, res, next) => {
  carritoS.createCarrito(req, res, req.user.id);
});

//Generar orden de compra
router.post('/profile', isAuthenticated, async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id })
  const carrito = await Carrito.findOne({user: req.user.id})
  const mailOptions = {
    from: 'Servidor Node.js',
    to: user.email,
    subject: `Productos de ${user.nombre}`,
    html: `${carrito.productos}`
  }
  try {
    const info = await transporter.sendMail(mailOptions)
    logger.info(info);
  } catch (error) {
    logger.error(error)
  }
  //twilio
  try {
    const message = await client.messages.create({
       body: `productos de ${user.nombre}: ${carrito.productos}`,
       from: '+19793106792',
       to: user.telefono
    })
 } catch (error) {
    logger.error(error)
 }
  res.json({mensaje: "orden de compra generada exitosamente"})
});

//Logout
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

//Middleware de autenticación. En caso de múltiples rutas protegidas, mejor usarlo a nivel de aplicacion
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/')
}

export default router;
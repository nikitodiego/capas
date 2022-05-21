import passport from 'passport';
import passportLocal from 'passport-local';
import User from '../models/users.js';
import  { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: 'nicojapaz@gmail.com',
      pass: 'ziypjcuwoxjigczl'
  }
});

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({ 'email': email })
  if (user) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  } else {
    const newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.nombre = req.body.nombre;
    newUser.edad = req.body.edad;
    newUser.telefono = req.body.telefono;
    newUser.direccion = req.body.direccion;
    newUser.avatar = req.body.avatar;
    await newUser.save();
    const mailOptions = {
      from: 'Servidor Node.js',
      to: 'nicojapaz@gmail.com',
      subject: 'Nuevo usuario registrado',
      html: `${newUser}`
    }
    try {
      const info = await transporter.sendMail(mailOptions)
      console.log(info)
    } catch (error) {
      console.log(error)
    }
    done(null, newUser);
  }
}));

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({email: email});
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, user);
}));

export default passportLocal

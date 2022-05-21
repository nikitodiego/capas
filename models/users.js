import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  password: String,
  nombre: String,
  edad: String,
  direccion: String,
  telefono: String,
  avatar: String
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('user', userSchema);
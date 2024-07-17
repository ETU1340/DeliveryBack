import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {MANAGER,CLIENT,LIVREUR} from '../services/roleService'
const options = { discriminatorKey: 'role', collection: 'users' };

// Schéma de base pour tous les utilisateurs
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, required: true, enum: [MANAGER,CLIENT,LIVREUR] },
}, options);

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword: string) {
  return
};

const User = mongoose.model('User', UserSchema);
export default User;
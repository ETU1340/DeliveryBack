const mongoose = require('mongoose');
const User = require('./User');

const ManagerSchema = new mongoose.Schema({
  livreurs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  companyName: { type: String, required: true },  // Modifier en une chaîne simple
  province: { type: String, required: true }   ,
  location :  {
    latitude: {type:Number} ,
    longitude:{type:Number} 
  }
});

const Manager = User.discriminator('Manager', ManagerSchema);
module.exports = Manager;

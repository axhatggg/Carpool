import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  socketId: { type: String }, 
  date: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema);

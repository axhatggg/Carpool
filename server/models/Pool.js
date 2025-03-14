import mongoose from 'mongoose';

const poolSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  from: String,
  to: String,
  seatsAvailable: { type: Number, default: 4 },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  pickupTime: String,  
  pickupLocation: String
});

const Pool = mongoose.model('Pool', poolSchema);

export default Pool;

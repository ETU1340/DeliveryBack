import mongoose from 'mongoose';

const UnavailableSchema = new mongoose.Schema({
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true }
});

const Unavailable = mongoose.model('Unavailable', UnavailableSchema);
export default Unavailable;

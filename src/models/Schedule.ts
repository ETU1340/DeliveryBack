import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Heure de début (ex: "08:00")
  endTime: { type: String, required: true },   // Heure de fin (ex: "17:00")
  deliveries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }] // Livraisons assignées à cette tournée
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;

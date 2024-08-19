import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // Use ISO 8601 format for consistency.
  endTime: { type: String, required: true },   // Same here.
  deliveries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Delivery' }]
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
export default Schedule;

import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
  {
    application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    scheduledAt: { type: Date, required: true },
    mode: { type: String, enum: ['onsite', 'online', 'phone'], default: 'online' },
    location: { type: String },
    message: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;

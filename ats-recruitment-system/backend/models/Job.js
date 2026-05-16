import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String },
    salaryRange: { type: String },
    seats: { type: Number, default: 1 },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;

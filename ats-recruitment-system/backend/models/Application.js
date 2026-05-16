import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    resumeUrl: { type: String, required: true },
    coverLetterUrl: { type: String },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'],
      default: 'Submitted'
    },
    hrNotes: { type: String }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate applications for the same job by the same candidate
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);

export default Application;

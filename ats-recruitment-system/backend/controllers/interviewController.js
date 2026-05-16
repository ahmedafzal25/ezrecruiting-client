import Interview from '../models/Interview.js';
import Application from '../models/Application.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Schedule an interview
// @route   POST /api/interviews
// @access  Private (Admin/HR)
export const scheduleInterview = async (req, res) => {
  try {
    const { applicationId, scheduledAt, mode, location, message } = req.body;

    const application = await Application.findById(applicationId)
      .populate('candidate', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name' }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const interview = await Interview.create({
      application: applicationId,
      scheduledAt,
      mode,
      location,
      message,
      createdBy: req.user._id
    });

    application.status = 'Interview Scheduled';
    await application.save();

    // Send email
    const { candidate, job } = application;
    const formattedDate = new Date(scheduledAt).toLocaleString();

    const emailBody = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #2b6cb0;">Interview Scheduled</h2>
          <p style="font-size: 16px; color: #4a5568;">Dear ${candidate.name},</p>
          <p style="font-size: 16px; color: #4a5568;">We are pleased to invite you to an interview for the <strong>${job.title}</strong> position at our <strong>${job.branch.name}</strong> branch.</p>
          <div style="background-color: #edf2f7; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date & Time:</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Mode:</strong> ${mode.charAt(0).toUpperCase() + mode.slice(1)}</p>
            ${location ? `<p style="margin: 5px 0;"><strong>Location/Link:</strong> ${location}</p>` : ''}
          </div>
          ${message ? `<p style="font-size: 16px; color: #4a5568; white-space: pre-wrap;"><strong>Note from HR:</strong><br>${message}</p>` : ''}
          <p style="font-size: 16px; color: #4a5568;">We look forward to speaking with you!</p>
        </div>
      </div>
    `;

    sendEmail({
      to: candidate.email,
      subject: `Interview Invitation: ${job.title}`,
      html: emailBody
    });

    res.status(201).json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all interviews
// @route   GET /api/interviews
// @access  Private (Admin/HR)
export const listInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate({
        path: 'application',
        populate: [
          { path: 'candidate', select: 'name email' },
          { path: 'job', select: 'title branch', populate: { path: 'branch', select: 'name' } }
        ]
      })
      .populate('createdBy', 'name');

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's interviews
// @route   GET /api/interviews/me
// @access  Private (Candidate)
export const myInterviews = async (req, res) => {
  try {
    // Find all applications owned by this candidate
    const applications = await Application.find({ candidate: req.user._id }).select('_id');
    const applicationIds = applications.map(app => app._id);

    // Find interviews linking to those applications
    const interviews = await Interview.find({ application: { $in: applicationIds } })
      .populate({
        path: 'application',
        populate: {
          path: 'job',
          select: 'title branch',
          populate: { path: 'branch', select: 'name' }
        }
      });

    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an interview
// @route   PUT /api/interviews/:id
// @access  Private (Admin/HR)
export const updateInterview = async (req, res) => {
  try {
    const { scheduledAt, mode, location, message } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (scheduledAt) interview.scheduledAt = scheduledAt;
    if (mode) interview.mode = mode;
    if (location !== undefined) interview.location = location;
    if (message !== undefined) interview.message = message;

    const updatedInterview = await interview.save();
    res.json(updatedInterview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an interview
// @route   DELETE /api/interviews/:id
// @access  Private (Admin/HR)
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    await Interview.deleteOne({ _id: interview._id });
    res.json({ message: 'Interview removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

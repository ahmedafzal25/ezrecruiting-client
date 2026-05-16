import Application from '../models/Application.js';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Candidate)
export const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl, coverLetterUrl } = req.body;

    const application = await Application.create({
      candidate: req.user._id,
      job: jobId,
      resumeUrl,
      coverLetterUrl
    });

    // Update user's latest resumeUrl
    await User.findByIdAndUpdate(req.user._id, { resumeUrl });

    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's applications
// @route   GET /api/applications/me
// @access  Private (Candidate)
export const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: {
          path: 'branch',
          select: 'name city'
        }
      });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all applications (with filters)
// @route   GET /api/applications
// @access  Private (Admin/HR)
export const listAllApplications = async (req, res) => {
  try {
    const { jobId, status } = req.query;
    const query = {};

    if (jobId) query.job = jobId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('candidate', 'name email phone resumeUrl profileImage')
      .populate({
        path: 'job',
        select: 'title branch',
        populate: {
          path: 'branch',
          select: 'name'
        }
      });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email phone resumeUrl profileImage')
      .populate({
        path: 'job',
        populate: {
          path: 'branch',
          select: 'name city address'
        }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check ownership if candidate
    if (req.user.role === 'candidate' && application.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin/HR)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, hrNotes } = req.body;
    
    const allowedStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Selected'];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'branch', select: 'name' }
      });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) application.status = status;
    if (hrNotes !== undefined) application.hrNotes = hrNotes;

    const updatedApplication = await application.save();

    // Trigger emails for certain status changes
    if (status) {
      const { candidate, job } = application;
      const jobTitle = job.title;
      const branchName = job.branch.name;

      let subject = '';
      let emailBody = '';

      const layout = (content) => `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${content}
          </div>
        </div>
      `;

      if (status === 'Shortlisted') {
        subject = "You've been shortlisted!";
        emailBody = layout(`
          <h2 style="color: #2b6cb0;">Congratulations, ${candidate.name}!</h2>
          <p style="font-size: 16px; color: #4a5568;">You have been shortlisted for the <strong>${jobTitle}</strong> position at our <strong>${branchName}</strong> branch.</p>
          <p style="font-size: 16px; color: #4a5568;">Our HR team will reach out to you shortly to schedule an interview.</p>
        `);
      } else if (status === 'Rejected') {
        subject = "Update on your application";
        emailBody = layout(`
          <h2 style="color: #2d3748;">Dear ${candidate.name},</h2>
          <p style="font-size: 16px; color: #4a5568;">Thank you for taking the time to apply for the <strong>${jobTitle}</strong> position at our <strong>${branchName}</strong> branch.</p>
          <p style="font-size: 16px; color: #4a5568;">After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
          <p style="font-size: 16px; color: #4a5568;">We wish you all the best in your job search.</p>
        `);
      } else if (status === 'Selected') {
        subject = "Congratulations! You've been selected!";
        emailBody = layout(`
          <h2 style="color: #38a169;">Welcome to the team, ${candidate.name}!</h2>
          <p style="font-size: 16px; color: #4a5568;">We are thrilled to offer you the <strong>${jobTitle}</strong> position at our <strong>${branchName}</strong> branch.</p>
          <p style="font-size: 16px; color: #4a5568;">Our HR department will send you the official offer letter and next steps shortly.</p>
        `);
      }

      if (subject && emailBody) {
        sendEmail({
          to: candidate.email,
          subject,
          html: emailBody
        });
      }
    }

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send custom HR message to candidate
// @route   POST /api/applications/:id/message
// @access  Private (Admin/HR)
export const sendCustomMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const application = await Application.findById(req.params.id)
      .populate('candidate', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h3 style="color: #2d3748;">Dear ${application.candidate.name},</h3>
          <p style="font-size: 16px; color: #4a5568; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `;

    // Await sending so we know it worked, or we can just float it
    sendEmail({
      to: application.candidate.email,
      subject,
      html: htmlContent
    });

    res.json({ message: 'Email dispatched successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

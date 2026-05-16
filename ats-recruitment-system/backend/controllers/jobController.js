import Job from '../models/Job.js';

// @desc    Get all open jobs (with optional filters)
// @route   GET /api/jobs
// @access  Public
export const listJobs = async (req, res) => {
  try {
    const { branch, department, q, all } = req.query;
    
    const query = {};

    // Only allow fetching all jobs if user is admin or hr
    if (all === 'true' && req.user && (req.user.role === 'admin' || req.user.role === 'hr')) {
      // No status filter
    } else {
      // Base query for open jobs
      query.status = 'open';
    }

    if (branch) {
      query.branch = branch;
    }

    if (department) {
      query.department = department;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const jobs = await Job.find(query).populate('branch', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('branch', 'name city address');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Admin/HR)
export const createJob = async (req, res) => {
  try {
    const { title, department, description, requirements, salaryRange, seats, branch, status } = req.body;

    const job = await Job.create({
      title,
      department,
      description,
      requirements,
      salaryRange,
      seats,
      branch,
      status: status || 'open',
      postedBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Admin/HR)
export const updateJob = async (req, res) => {
  try {
    const { title, department, description, requirements, salaryRange, seats, branch, status } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    job.title = title || job.title;
    job.department = department || job.department;
    job.description = description || job.description;
    job.requirements = requirements || job.requirements;
    job.salaryRange = salaryRange || job.salaryRange;
    job.seats = seats !== undefined ? seats : job.seats;
    job.branch = branch || job.branch;
    job.status = status || job.status;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await Job.deleteOne({ _id: job._id });
    res.json({ message: 'Job removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

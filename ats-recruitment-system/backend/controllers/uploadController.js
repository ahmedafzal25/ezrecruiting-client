import User from '../models/User.js';

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/upload/image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);

    if (user) {
      user.profileImage = req.file.path;
      await user.save();
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

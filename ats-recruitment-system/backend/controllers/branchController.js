import Branch from '../models/Branch.js';

// @desc    Get all branches
// @route   GET /api/branches
// @access  Public
export const listBranches = async (req, res) => {
  try {
    const branches = await Branch.find({});
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a branch
// @route   POST /api/branches
// @access  Private/Admin
export const createBranch = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    const branchExists = await Branch.findOne({ name });
    if (branchExists) {
      return res.status(400).json({ message: 'Branch already exists' });
    }

    const branch = await Branch.create({
      name,
      city,
      address
    });

    res.status(201).json(branch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
export const updateBranch = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    branch.name = name || branch.name;
    branch.city = city || branch.city;
    branch.address = address || branch.address;

    const updatedBranch = await branch.save();
    res.json(updatedBranch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);

    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    await Branch.deleteOne({ _id: branch._id });
    res.json({ message: 'Branch removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

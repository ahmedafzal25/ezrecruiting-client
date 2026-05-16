import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Branch from '../models/Branch.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from the root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedBranches = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding branches...');

    const branchesToSeed = [
      { name: 'Islamabad' },
      { name: 'Lahore' },
      { name: 'Karachi' },
      { name: 'Remote' }
    ];

    for (const b of branchesToSeed) {
      const exists = await Branch.findOne({ name: b.name });
      if (!exists) {
        await Branch.create(b);
        console.log(`Created branch: ${b.name}`);
      } else {
        console.log(`Branch already exists: ${b.name}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedBranches();

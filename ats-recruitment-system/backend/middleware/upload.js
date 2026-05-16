import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Resume Storage
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ats/resumes',
    allowed_formats: ['pdf', 'docx'],
    resource_type: 'auto',
  },
});

// Image Storage
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ats/profile_images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  },
});

export const uploadResume = multer({ storage: resumeStorage });
export const uploadImage = multer({ storage: imageStorage });

import multer from 'multer';
import { generateFileName } from '../utils/s3Files.util.js';

const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
      file.filename = generateFileName(file.originalname);
      cb(null, true);
    },
  });
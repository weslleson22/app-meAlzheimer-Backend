import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';

const allowedMimes = (
  process.env.ALLOWED_FILE_TYPES ||
  'image/jpeg,image/png,image/gif,image/svg+xml,image/webp'
).split(',');

export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(request, file, callback) {
      const hash = crypto.randomBytes(6).toString('hex');
      const fileName = `${hash}-${file.originalname}`;

      callback(null, fileName);
    },
  }),
  limits: {
    fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter(
    request: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void {
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error(
          'Invalid file type. Only JPEG, PNG, GIF, SVG, and WEBP images are allowed.'
        )
      );
    }
  },
};

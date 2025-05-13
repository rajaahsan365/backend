import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target uploads directory
const uploadDir = path.join(__dirname, '../../public/uploads');

// ✅ Create parent folders if missing
fs.mkdirSync(uploadDir, { recursive: true });

// Configure disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${unique}${ext}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = {
        video: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
        thumbnail: ['image/jpeg', 'image/png', 'image/webp'],
    };

    const field = file.fieldname;
    const allowedTypes = allowedMimeTypes[field];

    // If the field isn't one we expect (video or thumbnail), reject it
    if (!allowedTypes) {
        console.error(`Unexpected field name: ${field}`);
        return cb(new Error(`Unexpected field: ${field}`), false);
    }

    // Check if the file type is allowed for this field
    if (!allowedTypes.includes(file.mimetype)) {
        console.error(`Invalid file type for ${field}: ${file.mimetype}`);
        return cb(new Error(`${field} must be a valid ${field} file type`), false);
    }

    // Set max file size based on field type
    const maxSize = field === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024; // 100MB for video, 5MB for thumbnail

    if (file.size > maxSize) {
        return cb(new Error(`${field} file size exceeds the limit`), false);
    }

    cb(null, true);
};
// Multer middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // Max size for video (100MB)
    },
    fileFilter,
});

export default upload;

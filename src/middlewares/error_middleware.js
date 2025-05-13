import multer from "multer";

export const ErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer specific errors (like file size or field errors)
        return res.status(400).json({ message: `File upload error: ${err.message}` });
    } else if (err instanceof Error) {
        // Other types of errors (like validation errors)
        return res.status(400).json({ message: err.message });
    }

    // Catch-all for unexpected errors
    return res.status(500).json({ message: 'Something went wrong' });
};

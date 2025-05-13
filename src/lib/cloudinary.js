import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({
    path: "./.env",
});

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadFileToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)

        });

        fs.unlinkSync(filePath); // Delete the local file
        return result;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error('Error uploading file:', error);
        return null;
    }
};

const getPublicIdFromUrl = (url) => {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
};

export { uploadFileToCloudinary, getPublicIdFromUrl, cloudinary };
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({
    cloud_name: 'dvfw8zwjh',
    api_key: '568417226133178',
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});

const uploadFileToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'auto', // Automatically detect the resource type (image, video, etc.)

        });
        console.log('Upload successful:', result);
        // Optionally, you can delete the local file after uploading
        fs.unlinkSync(filePath); // Delete the local file
        return result;
    } catch (error) {
        fs.unlinkSync(filePath);
        console.error('Error uploading file:', error);
        return null;
    }
};

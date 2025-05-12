import { connect } from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI + "/youtube-backend");

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

import { uploadFileToCloudinary } from "../lib/cloudinary.js";
import User from "../models/user_model.js";
import { loginValidation, registerValidation } from "../utils/validate_schema.js";

export const registerController = async (req, res) => {
    try {
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const logoPath = req.file ? req.file.path : null; // Get the logo path from the request

        const { channelName, phoneNumber, email, password } = req.body;

        const existingUser = await User.findOne({
            email,
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const uploadLogo = await uploadFileToCloudinary(logoPath);

        const newUser = await User.create({
            channelName,
            phoneNumber,
            email,
            password,
            logo: uploadLogo.secure_url,
        });

        const refreshToken = await newUser.generateRefreshToken();
        const accessToken = await newUser.generateAccessToken();
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                channelName: newUser.channelName,
                phone: newUser.phone,
                email: newUser.email,
                logo: newUser.logo,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginController = async (req, res) => {
    try {
        // Validate the request body
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        console.log
        const isPasswordCorrect = user.isPasswordCorrect(password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const refreshToken = await user.generateRefreshToken();
        const accessToken = await user.generateAccessToken();
        res.status(200).json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                channelName: user.channelName,
                phone: user.phone,
                email: user.email,
                logo: user.logo,
            },
            tokens: {
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
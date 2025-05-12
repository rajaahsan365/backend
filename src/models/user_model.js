import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import REGEX_PATTERNS from '../utils/regex_patterns.js';

const userSchema = new Schema(
    {
        channelName: {
            type: String,
            required: ['Channel name is required'],
            trim: true,
            unique: true,
            minlength: [3, 'Channel name must be at least 3 characters'],
        },
        phoneNumber: {
            type: String,
            required: ['Phone number is required'],
            unique: true,
            match: [REGEX_PATTERNS.phoneNumber, 'Please enter a valid 10-digit phone number'],
        },
        email: {
            type: String,
            required: ['Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                REGEX_PATTERNS.email,
                'Please enter a valid email address',
            ],
        },
        password: {
            type: String,
            required: ['Password is required'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        logo: {
            type: String,
            default: 'https://placehold.co/200x200 ',
        },
        subscribers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        subscribedChannels: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        timestamps: true,
    }
);

/**
 * Hash password before saving user
 */
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

/**
 * Compare input password with hashed password
 */
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/** 
 * Generate Access Token (JWT)
 */
userSchema.methods.generateAccessToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email,
            channelName: this.channelName,
            phone: this.phone,
        },
        process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key',
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
        }
    );
};

/**
 * Generate Refresh Token (JWT)
 */
userSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key',
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
        }
    );
};

const User = model('User', userSchema);
export default User;
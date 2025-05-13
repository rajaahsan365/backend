import jwt from 'jsonwebtoken';
import User from '../models/user_model.js';
import { TOKEN_COOKIE_OPTIONS } from '../utils/cookies.js';

export const authenticateUser = async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;

    // 1. Check if both tokens exist
    if (!accessToken || !refreshToken) {
        return res.status(401).json({ message: 'Unauthorized: Tokens missing' });
    }

    // 2. Try verifying access token
    try {
        const decoded = await jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_key'
        );
        req.user = decoded;
        return next(); // Access token valid, proceed
    } catch (accessErr) {
        // 3. Access token invalid/expired – verify refresh token
        try {
            const decodedRefresh = await jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_key'
            );

            // 4. Refresh tokens if refresh token is valid
            // 2. Get user from DB
            const user = await User.findById(decodedRefresh._id);
            if (!user) {
                throw new Error('User not found');
            }

            // 3. Use model methods to generate new tokens
            const newAccessToken = await user.generateAccessToken();
            const newRefreshToken = await user.generateRefreshToken();

            // 4. Set tokens in cookies again
            res.cookie('accessToken', newAccessToken, TOKEN_COOKIE_OPTIONS);
            res.cookie('refreshToken', newRefreshToken, TOKEN_COOKIE_OPTIONS);

            req.user = await jwt.decode(newAccessToken);
            return next();

        } catch (refreshErr) {
            // 5. Refresh token also invalid/expired
            res.clearCookie('accessToken', TOKEN_COOKIE_OPTIONS);
            res.clearCookie('refreshToken', TOKEN_COOKIE_OPTIONS);
            return res.status(401).json({ message: 'Unauthorized: Session expired' });
        }
    }
};

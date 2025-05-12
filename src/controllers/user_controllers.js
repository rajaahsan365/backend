import registerValidation from "../utils/validate_register_user.js";

export const register = async (req, res) => {
    try {
        const { error } = registerValidation(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { channelName, phone, email, password, logo } = req.body;

        const existingUser = await User.findOne({
            $or: [{ channelName }, { phone }, { email }],
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            channelName,
            phone,
            email,
            password: hashedPassword,
            logo,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET || 'secret_key', {
            expiresIn: '30d',
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: newUser._id,
                channelName: newUser.channelName,
                phone: newUser.phone,
                email: newUser.email,
                logo: newUser.logo,
            },
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
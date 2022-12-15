import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import filterObject from '../utils/filterObject.js';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const filteredBody = filterObject(
            req.body,
            'firstName',
            'lastName',
            'email',
            'password',
            'picturePath',
            'friends',
            'location',
            'occupation'
        );

        const passwordHash = await bcrypt.hash(filteredBody.password, 12);

        const savedUser = await User.create({
            ...filteredBody,
            password: passwordHash,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* LOGGING IN */

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        console.log(req.body);

        let isMatch;

        if (user) {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            res.status(401).json({
                message: 'Invalid email address or password.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;

        res.status(200).json({
            token,
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

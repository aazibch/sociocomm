import jwt from 'jsonwebtoken';

export const verifyToken = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = token.split(' ')[1];
        }

        if (!token) {
            return res.status(403).json({
                message: 'You are not logged in.'
            });
        }

        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

        req.user = verifiedUser;
        next();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

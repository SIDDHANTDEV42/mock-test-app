import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET is missing or too short.');
    }
    return secret;
};

export const signToken = (payload: object) => {
    return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, getJwtSecret());
    } catch (error) {
        return null;
    }
};

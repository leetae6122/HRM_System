import jwt from 'jsonwebtoken';

export const createJwt = (payload, secret, expire) => {
    return jwt.sign(
        payload,
        secret,
        {
            expiresIn: expire
        }
    );
}

export const verifyToken = (token, jwtSecret) => {
    return jwt.verify(token, jwtSecret);
};

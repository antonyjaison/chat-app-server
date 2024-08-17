const jwt = require('jsonwebtoken');

import type { Request, Response } from 'express'

const secretKey = process.env.JWT_SECRET

export const authenticateToken = (req: Request, res: Response, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

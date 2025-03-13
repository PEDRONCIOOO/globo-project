import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/pages/api/mongoose';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { setCookie } from 'cookies-next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;

    try {
        await db;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                email: user.email 
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );
        // Set HTTP-only cookie
        setCookie('auth-token', token, { 
            req, 
            res, 
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error during login', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
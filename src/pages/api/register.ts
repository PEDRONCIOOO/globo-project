import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/pages/api/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password, name } = req.body;

    try {
        // Ensure the database connection is established
        await db;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
        });

        await user.save();
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
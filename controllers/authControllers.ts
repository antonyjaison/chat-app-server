import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../src/db/index';
import { InsertUser, usersTable } from '../src/db/schema';
import { eq } from 'drizzle-orm'

// Secret key for JWT (in a real app, this should come from an environment variable)
const JWT_SECRET = process.env.JWT_SECRET!;

// Controller for user registration
export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
        console.log(existingUser);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser: InsertUser = {
            name,
            email,
            password_hash: hashedPassword,
        };

        // Insert the new user into the database
        await db.insert(usersTable).values(newUser);

        // Return success response
        return res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller for user login
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user[0].password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { userId: user[0].id, email: user[0].email },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Return the token
        return res.status(200).json({ token });

    } catch (error) {
        console.error('Error during user login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const validateUser = async (req: Request, res: Response) => {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await db.select({ id: usersTable.id, name: usersTable.name, email: usersTable.email }).from(usersTable).where(eq(usersTable.email, decoded.email));

        console.log(user);

        // Return the decoded token
        return res.status(200).json(user);

    } catch (error) {
        console.error('Error during token validation:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
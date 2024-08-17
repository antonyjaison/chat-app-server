import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../src/db/index';
import { InsertUser, usersTable } from '../src/db/schema';
import { eq, ne } from 'drizzle-orm'

export const getAllContacts = async (req: Request, res: Response) => {
    console.log(req.user.email)
    try {
        const contacts = await db.select().from(usersTable).where(ne(usersTable.email, req.user.email));
        return res.status(200).json(contacts);
    } catch (error) {
        console.error('Error getting contacts:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
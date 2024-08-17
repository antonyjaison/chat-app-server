import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';

import type { Request, Response } from 'express'

import authRoutes from '../routes/authRoutes'
import contactRoutes from '../routes/contactsRoutes'

dotenv.config()

const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api/auth', authRoutes)
app.use('/api/contacts', contactRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})

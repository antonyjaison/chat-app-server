import express from 'express'
import { registerUser, loginUser, validateUser } from '../controllers/authControllers'

const router = express.Router()

router.post('/login', loginUser)

router.post('/register', registerUser)

router.get('/validate-user', validateUser)

export default router
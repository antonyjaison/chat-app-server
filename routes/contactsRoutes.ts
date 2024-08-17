import express from 'express';

import { getAllContacts } from '../controllers/contactController'
import { authenticateToken } from '../middleware/authenticateToken'

const router = express.Router();

router.get('/get-all-contacts', authenticateToken ,getAllContacts);

export default router;
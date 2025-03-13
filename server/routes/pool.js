import express from 'express';
import { authenticateUser, authenticateDriver } from '../middleware/authMiddleware.js';
import { createPool, joinPool, acceptPool, getAllPools } from '../controllers/poolController.js';

const router = express.Router();

router.post('/create', authenticateUser, createPool);
router.post('/join/:poolId', authenticateUser, joinPool);
router.post('/accept/:poolId', authenticateDriver, acceptPool);
router.get('/all', getAllPools);

export default router;

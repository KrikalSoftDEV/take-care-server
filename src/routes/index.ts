import { Router } from 'express';
import authcontroller from './auth.routes';

const router = Router();

router.use('/auth', authcontroller);

export default router;

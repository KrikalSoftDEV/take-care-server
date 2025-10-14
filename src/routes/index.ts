import { Router } from 'express';
import authcontroller from './auth.routes';
import dependentController from './dependent.routes'

const router = Router();

router.use('/auth', authcontroller);
router.use('/dependent', dependentController);

export default router;

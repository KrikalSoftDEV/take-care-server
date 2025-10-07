import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import * as authController from '../controller/auth.controller';
import { registerSchema } from '../validations/auth.validation';
import {verifyTokenHandler} from '../services/verifyToken.service';


const router = Router();


router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await registerSchema.validateAsync(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
  },
  authController.handleToRegisterCareProviderUser
);



router.post('/login',  authController.handleToLogin);
router.get('/get/profile',verifyTokenHandler,authController.handleToExtractToken)


export default router;
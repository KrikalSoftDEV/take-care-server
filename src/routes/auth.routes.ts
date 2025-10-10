import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import * as authController from '../controller/auth.controller';
import {
  registerSchema,
  generateOtpForVerifyMobileSchema,
  loginSchema
} from '../validations/auth.validation';
import { verifyTokenHandler } from '../services/verifyToken.service';


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

// route for generate Otp for verify mobile
router.post(
  '/generate-otp',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await generateOtpForVerifyMobileSchema.validateAsync(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
  },
  authController.handleToGeneateOtpForVerifyMobile
);

// route for login care_provider via verify Otp
router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await loginSchema.validateAsync(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
  },
  authController.handleToLoginCareProviderUser
);

export default router;
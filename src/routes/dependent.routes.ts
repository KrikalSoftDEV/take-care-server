import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import * as dependentController from '../controller/dependentUserController';
import { verifyTokenHandler } from '../services/verifyToken.service';

import {
    addDependentUser,
    updateDependentUser,
    deleteDependentUser

} from '../validations/dependentUser.validation'

const router = Router();

// add dependent user by care provider
router.post('/add-dependent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await addDependentUser.validateAsync(req.body);
        next();
    } catch (err: any) {
        return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
}, verifyTokenHandler, dependentController.handleToAddTheDependentUserByProvider);

// update dependent user by care provider
router.patch('/update-dependent', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await updateDependentUser.validateAsync(req.body);
        next();
    } catch (err: any) {
        return res.status(400).json({ error: err.details ? err.details[0].message : err.message });
    }
}, verifyTokenHandler, dependentController.handleToUpdateTheDependentUserByProvider);

// delete dependent user by care provider
router.delete(
  '/delete-dependent/:dependentId',
  verifyTokenHandler,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteDependentUser.validateAsync(req.params);
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: err.details ? err.details[0].message : err.message,
      });
    }
  },
  dependentController.handleToDeleteTheDependentUserByProvider
);


export default router;

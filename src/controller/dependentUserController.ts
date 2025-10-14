import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import Dependent from '../models/dependent.model';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import validator from "validator";
import redisClient from '../config/redis';
import { createTokenHandler } from '../middleware/auth.middleware';
import entityIdGenerator from '../utils/entitityIdGenerator';
import { generateOtpBySystem } from '../services/index.service';
import CustomError from '../utils/index'

export const handleToAddTheDependentUserByProvider = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const DecodedToken = req.user;
        if (!DecodedToken || !DecodedToken.providerId || DecodedToken.role!="provider") {
            return res.status(401).json({ message: 'Unauthorized: Invalid token data' });
        }
        const careProviderInfo = await User.findOne({ providerId: DecodedToken.providerId, role: DecodedToken.role });
        if (!careProviderInfo) {
            return res.status(404).json({ message: 'Care provider not found' });
        }
        if (careProviderInfo) {
            const payload = req.body;
            if (!payload || Object.keys(payload).length === 0) {
                throw new CustomError(400, "Request body cannot be empty.");
            }
            if (!payload.firstName || !payload.lastName || !payload.email
                || !payload.mobile || !payload.address.city
                || !payload.gender || !payload.age
            ) {
                throw new CustomError(400, "All fields (firstName, lastName, email, mobile, address.city, gender, age) are required.");
            }

            const existingDependentUser = await Dependent.findOne({ email: payload.email.toLowerCase() });
            if (existingDependentUser) {
                throw new CustomError(409, "Dependent user already exists with this email.");
            }
            if (!existingDependentUser) {
                const dependentGeneratedId = entityIdGenerator("DPT");
                const newDependentUser = new Dependent({
                    dependentId: dependentGeneratedId,
                    careProviderId: careProviderInfo.providerId,
                    providerName: careProviderInfo.firstName + " " + careProviderInfo.lastName,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email.toLowerCase(),
                    gender: payload.gender,
                    age: payload.age,
                    mobile: payload.mobile,
                    address: {
                        street: payload.address.street || '',
                        city: payload.address.city,
                        state: payload.address.state || '',
                        zipCode: payload.address.zipCode || '',
                        country: payload.address.country || ''
                    },
                    providerId: careProviderInfo.providerId,
                    providerMobileNo: careProviderInfo.mobile,
                    medicalCondition: payload.medicalCondition || '',
                    hospitalised: payload.hospitalised || false,
                    DOB: payload.DOB || null,
                    relationship: payload.relationship || '',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
                await newDependentUser.save();
                res.status(201).json({
                    message: "Dependent user added successfully", dependentUser: newDependentUser
                });
            }
        }
    }
    catch (err: any) {
        console.error("add dependent user Error:", err.message);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

}

export const handleToUpdateTheDependentUserByProvider = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user;
        if (!decodedToken || !decodedToken.providerId || !decodedToken.role) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token data' });
        }
        const careProviderInfo = await User.findOne({ providerId: decodedToken.providerId, role: decodedToken.role });
        if (!careProviderInfo) {
            return res.status(404).json({ message: 'Care provider not found' });
        }
        if (careProviderInfo) {
            const payload = req.body;
            if (!payload || Object.keys(payload).length === 0) {
                throw new CustomError(400, "Request body cannot be empty.");
            }
            if (!payload.dependentId) {
                throw new CustomError(400, "DependentId is required to update the dependent user.");
            }
            const dependentUserInfo = await Dependent.findOne({ dependentId: payload.dependentId, providerId: careProviderInfo.providerId });
            if (!dependentUserInfo) {
                throw new CustomError(404, "Dependent user not found.");
            }
            if (dependentUserInfo) {
                const updateDependentUser = await Dependent.findOneAndUpdate(
                    { dependentId: payload.dependentId, providerId: careProviderInfo.providerId },
                    { $set: payload, updatedAt: new Date() },
                    { new: true }
                );
                res.status(200).json({ message: "Dependent user updated successfully", dependentUser: updateDependentUser });
            }
        }
    }
    catch (err: any) {
        console.error("add dependent user Error:", err.message);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

export const handleToDeleteTheDependentUserByProvider = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken = req.user;

    if (!decodedToken || !decodedToken.providerId || !decodedToken.role) {
      throw new CustomError(401, "Unauthorized: Invalid token data");
    }

    const careProviderInfo = await User.findOne({
      providerId: decodedToken.providerId,
      role: decodedToken.role,
    });

    if (!careProviderInfo) {
      throw new CustomError(404, "Care provider not found.");
    }

    const { dependentId } = req.params;

    if (!dependentId) {
      throw new CustomError(400, "DependentId is required in URL parameter.");
    }

    const dependentUserInfo = await Dependent.findOne({
      dependentId,
      providerId: careProviderInfo.providerId,
    });

    if (!dependentUserInfo) {
      throw new CustomError(404, "Dependent user not found.");
    }

    await Dependent.findOneAndDelete({
      dependentId,
      providerId: careProviderInfo.providerId,
    });

    res.status(200).json({
      message: "Dependent user deleted successfully.",
      deletedDependentId: dependentId,
    });
  } catch (err: any) {
    console.error("delete dependent user Error:", err.message);
    if (err instanceof CustomError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

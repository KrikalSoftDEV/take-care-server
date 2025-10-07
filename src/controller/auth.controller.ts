import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import validator from "validator";
import redisClient from '../config/redis';
import { createTokenHandler } from '../middleware/auth.middleware';
import entityIdGenerator from '../utils/entitityIdGenerator';

type UserPayload = {
    _id: string;
    email: string;
    name: string;
    role: string;
    userId?: string;
    teacherId?: string;
    mobile?: string;
};

class CustomError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const handleToRegisterCareProviderUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;


        if (!payload || Object.keys(payload).length === 0) {
            throw new CustomError(400, "Request body cannot be empty.");
        }


        if (!payload.firstName || !payload.lastName || !payload.email || !payload.mobile || !payload.role) {
            throw new CustomError(400, "All fields (firstName, lastName, email, mobile, role) are required.");
        }

        if (!validator.isEmail(payload.email)) {
            throw new CustomError(400, "Invalid email address.");
        }

        if (!/^[0-9]{10}$/.test(payload.mobile)) {
            throw new CustomError(400, "Invalid mobile number. Must be 10 digits.");
        }

        const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
        if (existingUser) {
            throw new CustomError(409, "User already exists with this email.");
        }

        const generatedId = entityIdGenerator("USR");

        const newUser = new User({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email.toLowerCase(),
            mobile: payload.mobile,
            role: payload.role === "user" ? "user" : "careTaker",
            userId: generatedId,
            createdAt: new Date(),
            updatedOn: new Date(),
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully.",
            user: {
                userId: newUser.userId,
                name: `${newUser.firstName} ${newUser.lastName}`,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                mobile: newUser.mobile,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedOn: newUser.updatedOn,
            },
        });
    } catch (err: any) {
        console.error("Registration Error:", err.message);
        if (err instanceof CustomError) {
            res.status(err.statusCode).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};

export const handleToLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;

        if (!payload.mobile || !payload.otp) {
            return res.status(400).json({ message: 'Mobile and OTP are required' });
        }

        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(payload.otp, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const userToken: UserPayload = {
            _id: (user._id as unknown as { toString: () => string }).toString(),
            email: user.email,
            name: user.firstName + " " + user.lastName,
            role: user.role,
            userId: user.userId ? user.userId.toString() : undefined,
        };
        const token = createTokenHandler(userToken);
        user.token = token;
        await user.save();
        res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        next(err);
    }
};

export const handleToExtractToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = (req as AuthRequest).user;
        console.log("CJJKCJNC", decodedToken)
        if (!decodedToken || !decodedToken.email) {
            return res.status(400).json({ message: 'Invalid or missing token' });
        }
        const user = await User.findOne({ email: decodedToken.email });
        res.status(200).json({
            user
        })



    }
    catch (err) {
        next(err)
    }
}






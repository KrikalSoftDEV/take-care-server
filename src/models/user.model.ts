import { Schema, model, Document } from 'mongoose';


export interface User extends Document {
    email: string;
    firstName: string;
    lastName: string;
    mobile: string;
    password: string;
    createdAt: Date;
    role: 'user' | 'admin';
    updatedOn?: Date;
    token: String;
    otp?: String;   
    profileImg?: String;                                                
    providerId?: String;
}

const userSchema = new Schema<User>({
    email: {
        type: String,
        unique: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
     mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        enum: ['dependent', 'provider', 'admin'],
    },
     profileImg: {
        type: String,
        default: function () {
            return `${process.env.BASE_URL || "http://localhost:4000/uploads/default-profile.png"}`;
        }
    },
    providerId: {
        type: String,
    },
    token: {
        type: String,
    },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedOn: {
        type: Date,
        default: Date.now,
    }
});
export default model<User>('User', userSchema);
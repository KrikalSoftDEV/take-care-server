import mongoose, { Schema, model, Document, Model } from 'mongoose';

export interface Dependent extends Document {
    name?: string;
    age?: number;
    relationship?: string;
    providerId?: string;
    dependentId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    mobile?: number;
    DOB?: Date;
    gender?: string;
    address?: {
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
        pincode?: string;
    };
    providerName?: string;
    providerMobileNo?: string;
    medicalCondition?: string;
    hospitalised?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
const dependedentSchema = new Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    dependentId: {
        type: String,
    },
    age: {
        type: Number,
    },
    relationship: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    gender: {
        type: String,
    },
    address: {
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        pincode: {
            type: String,
        }
    },
    providerId: {
        type: String,
    },
    providerName: {
        type: String,
    },
    providerMobileNo: {
        type: String,
    },
    medicalCondition: {
        type: String,
    },
    hospitalised: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

export default model<Dependent>('Dependent', dependedentSchema);
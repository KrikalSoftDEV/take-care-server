import mongoose, { Schema, model, Document, Model } from 'mongoose';
export interface Medicine extends Document {
    dependentId?: string;
    providerId?: string;
    medicineName?: string;
    dosage?: string;
    frequency?: string;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


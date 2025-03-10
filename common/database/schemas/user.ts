import { type InferSchemaType, Schema } from 'mongoose';

export const userSchema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

export type UserSchema = InferSchemaType<typeof userSchema>;

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
  email: string;
  passwordHash: string;
  referralCode: string;
  referredBy?: mongoose.Types.ObjectId | null;
  credits: number;
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  credits: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUserDocument>('User', UserSchema);

import mongoose, { Document, Schema } from 'mongoose';

export type ReferralStatus = 'pending' | 'converted';

export interface IReferral {
  referrer: mongoose.Types.ObjectId;
  referred: mongoose.Types.ObjectId;
  status: ReferralStatus;
  credited: boolean;
  createdAt?: Date;
}

export interface IReferralDocument extends IReferral, Document {}

const ReferralSchema = new Schema<IReferralDocument>({
  referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referred: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','converted'], default: 'pending' },
  credited: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IReferralDocument>('Referral', ReferralSchema);

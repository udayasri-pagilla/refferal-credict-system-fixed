import mongoose, { Document, Schema } from 'mongoose';

export interface IPurchase {
  user: mongoose.Types.ObjectId;
  amount: number;
  createdAt?: Date;
}

export interface IPurchaseDocument extends IPurchase, Document {}

const PurchaseSchema = new Schema<IPurchaseDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPurchaseDocument>('Purchase', PurchaseSchema);

import mongoose from 'mongoose';
import { userSchema } from './userModel';

const refreshTokenSchema = new mongoose.Schema(
  {
    expiresAt: {
      type: Date,
      required: true,
    },
    user: {
      type: userSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model('RefreshToken', refreshTokenSchema);

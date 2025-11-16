import { Router } from 'express';
import auth from '../middlewares/auth';
import Referral from '../models/Referral';
import Purchase from '../models/Purchase';
import User from '../models/User';

const router = Router();

router.get('/', auth, async (req, res) => {
  const user = req.user!;
  try {
    const referredUsers = await Referral.find({ referrer: user._id }).populate('referred');
    const totalReferred = referredUsers.length;

    // Count converted referrals
    const converted = await Referral.countDocuments({ referrer: user._id, status: 'converted' });

    // Total credits from user record
    const freshUser = await User.findById(user._id);
    const credits = freshUser?.credits || 0;

    return res.json({ totalReferred, converted, credits, referralCode: user.referralCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to load dashboard' });
  }
});

export default router;

import { Router } from 'express';
import auth from '../middlewares/auth';
import Purchase from '../models/Purchase';
import Referral from '../models/Referral';
import User from '../models/User';

const router = Router();

// Simulate a purchase for the authenticated user
router.post('/buy', auth, async (req, res) => {
  const user = req.user!;
  const amount = Number(req.body.amount || 10);

  try {
    // Check if user has enough credits
    const currentUser = await User.findById(user._id);
    if (!currentUser || currentUser.credits < amount) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Check if this is the user's first purchase
    const previous = await Purchase.findOne({ user: user._id });
    const isFirst = !previous;

    // Deduct credits from buyer
    await User.findByIdAndUpdate(user._id, { $inc: { credits: -amount } });

    // Create purchase record
    const purchase = new Purchase({ user: user._id, amount });
    await purchase.save();

    let referralBonus = false;
    if (isFirst) {
      // If user was referred, and referral not yet credited, credit both
      const referral = await Referral.findOne({ referred: user._id });
      if (referral && !referral.credited) {
        // credit 2 to both (bonus for first purchase via referral)
        await User.findByIdAndUpdate(referral.referrer, { $inc: { credits: 2 } });
        await User.findByIdAndUpdate(referral.referred, { $inc: { credits: 2 } });
        referral.status = 'converted';
        referral.credited = true;
        await referral.save();
        referralBonus = true;
      }
    }

    // Fetch updated user to return final credits
    const updatedUser = await User.findById(user._id);
    return res.json({ 
      ok: true, 
      purchase: { id: purchase._id, isFirst, referralBonus },
      credits: updatedUser?.credits || 0,
      message: 'Purchase successful' 
    });
  } catch (err) {
    console.error('Purchase error:', err);
    const errMsg = (err as any).message || 'Purchase failed';
    return res.status(500).json({ message: errMsg });
  }
});

export default router;

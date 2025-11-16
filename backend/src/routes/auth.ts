import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import Referral from '../models/Referral';
import generateReferralCode from '../utils/generateReferralCode';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, referralCode } = req.body as { email: string; password: string; referralCode?: string };
    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      const passwordHash = await bcrypt.hash(password, 10);
      let code = generateReferralCode(email);
      // ensure unique code
      let i = 0;
      while (await User.findOne({ referralCode: code })) {
        i += 1;
        code = `${code}${i}`;
      }

      const newUser = new User({ email, passwordHash, referralCode: code });
      if (referralCode) {
        const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
        if (referrer) {
          newUser.referredBy = referrer._id;
        }
      }

      await newUser.save();

      // create referral record if referredBy exists
      if (newUser.referredBy) {
        await Referral.create({ referrer: newUser.referredBy, referred: newUser._id });
      }

      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.json({ token, user: { email: newUser.email, referralCode: newUser.referralCode } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body as { email: string; password: string };
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'Invalid credentials' });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
      return res.json({ token, user: { email: user.email, referralCode: user.referralCode } });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;


import jwt from 'jsonwebtoken';
import express from 'express';

const router = express.Router();

router.post('/generate-token', (req, res) => {

  if (!validCredentials(req.body)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }


  const token = jwt.sign(
    { userId: req.user.id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '10d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
  }).json({ success: true });
});

export default router;
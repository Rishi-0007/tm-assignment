import { Router } from 'express';
import { register, login, refreshToken, logout } from '../controllers/auth';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, async (req, res) => {
    // Inject userId from token into body for controller or handle directly
    req.body.userId = (req as AuthRequest).user?.userId;
    await logout(req, res);
});

export default router;

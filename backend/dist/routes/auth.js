"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', auth_1.register);
router.post('/login', auth_1.login);
router.post('/refresh', auth_1.refreshToken);
router.post('/logout', auth_2.authenticateToken, async (req, res) => {
    // Inject userId from token into body for controller or handle directly
    req.body.userId = req.user?.userId;
    await (0, auth_1.logout)(req, res);
});
exports.default = router;

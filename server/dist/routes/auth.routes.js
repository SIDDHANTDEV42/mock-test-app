"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware");
const router = (0, express_1.Router)();
const authLimiter = (0, rateLimit_middleware_1.rateLimiter)({ windowMs: 15 * 60 * 1000, max: 100 }); // 15 mins, 100 requests
router.post('/register', authLimiter, auth_controller_1.register);
router.post('/login', authLimiter, auth_controller_1.login);
router.post('/logout', auth_controller_1.logout);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.getMe);
exports.default = router;

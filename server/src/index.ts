import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import testRoutes from './routes/test.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import announcementRoutes from './routes/announcement.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { csrfProtection } from './middleware/csrf.middleware';

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGIN'];
const optionalEnv = ['GOOGLE_CLIENT_ID', 'NODE_ENV', 'COOKIE_SECURE', 'COOKIE_SAMESITE'];
const missing = requiredEnv.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('Missing required env vars:', missing);
    process.exit(1);
}

if ((process.env.JWT_SECRET || '').length < 32) {
    console.error('JWT_SECRET must be at least 32 characters long.');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const defaultAllowedOrigins = [
    'http://localhost:3000',
    'https://examprep-showcase.vercel.app',
];

const allowedOrigins = () => {
    const origins = [
        process.env.CORS_ORIGIN,
        process.env.CORS_ALLOWED_ORIGINS,
        ...defaultAllowedOrigins,
    ];

    return new Set(
        origins
            .flatMap(origin => (origin || '').split(','))
            .map(origin => origin.trim())
            .filter(Boolean)
    );
};

// Middleware
app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins().has(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(cookieParser());
app.use(csrfProtection);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/announcements', announcementRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment variables validated.');
    console.log('Optional env vars check:', optionalEnv.map(key => `${key}: ${process.env[key] ? 'SET' : 'NOT SET'}`).join(', '));
});

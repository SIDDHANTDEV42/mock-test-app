import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import questionRoutes from './routes/question.routes';
import testRoutes from './routes/test.routes';
import userRoutes from './routes/user.routes';
import reviewRoutes from './routes/review.routes';
import announcementRoutes from './routes/announcement.routes';

dotenv.config(); // Loads .env from the current directory (server/) or as specified in environment

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

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

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Validate Env Vars
    const requiredEnv = ['DATABASE_URL', 'JWT_SECRET'];
    const missing = requiredEnv.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error('Missing required env vars:', missing);
        process.exit(1);
    } else {
        console.log('Environment variables validated.');
    }
});

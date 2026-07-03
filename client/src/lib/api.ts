import axios from 'axios';

const productionApiUrl = 'https://examprep-showcase-api.onrender.com/api';
const localApiUrl = 'http://localhost:5000/api';

const defaultApiUrl =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? localApiUrl
        : '/api';

const api = axios.create({
    baseURL: defaultApiUrl || process.env.NEXT_PUBLIC_API_URL || productionApiUrl,
    withCredentials: true, // Important for HttpOnly cookies
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

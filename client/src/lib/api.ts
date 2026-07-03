import axios from 'axios';

const productionApiUrl = 'https://examprep-showcase-api.onrender.com/api';
const localApiUrl = 'http://localhost:5000/api';

const defaultApiUrl =
    typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)
        ? localApiUrl
        : productionApiUrl;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || defaultApiUrl,
    withCredentials: true, // Important for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

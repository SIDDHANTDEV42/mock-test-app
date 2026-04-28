export interface User {
    id: string;
    email: string;
    name: string | null;
    role: 'STUDENT' | 'ADMIN';
    stream?: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export interface LoginRequest {
    username: string;
    password?: string;
}

export interface RegisterRequest extends LoginRequest {
    email: string;
    rol?: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface RefreshDTO {
    refresh: string;
}

export interface User {
    sub: string; // username
    roles?: string[];
    exp?: number;
}

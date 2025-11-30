import { http } from "../http"

export interface LoginData {
    email: string;
    password: string;
}

export interface SignupData {
    username: string;
    name: string;
    email: string;
    password: string
}

export const loginApi = (data: LoginData) => http.post("/auth/login", data);

export const signupApi = (data: SignupData) => http.post("/auth/signup", data)

export const logoutApi = () => http.post("/auth/logout");
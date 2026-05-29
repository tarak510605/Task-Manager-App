import type { AuthResponse, User } from "../types";
import { api } from "./api";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterInput) {
    const { data } = await api.post<AuthResponse>("/auth/register", payload);
    return data;
  },
  async login(payload: LoginInput) {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);
    return data;
  },
  async profile() {
    const { data } = await api.get<User>("/auth/profile");
    return data;
  }
};

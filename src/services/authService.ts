import { ApiClient } from './apiClient';

export interface UserRole {
  role?: {
    name?: string;
  };
  name?: string;
}

export interface UserProfile {
  id?: string;
  userId?: string;
  gender?: string;
  birthDate?: string;
  nationality?: string;
  university?: string;
  faculty?: string;
  country?: string;
  city?: string;
  address?: string;
  bio?: string;
  [key: string]: any;
}

export interface User {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  whatsappPhone?: string;
  avatar?: string | null;
  role?: string;
  roles?: (string | UserRole)[];
  userRoles?: UserRole[];
  status?: string;
  isVerified?: boolean;
  profile?: UserProfile | null;
  createdAt?: string;
  [key: string]: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  whatsappPhone?: string;
  roles: 'tenant' | 'owner';
}

export interface VerifyOtpData {
  email: string;
  otp: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  data?: {
    user?: User;
    [key: string]: any;
  };
  user?: User;
}

export class AuthService {
  /**
   * 1. POST /auth/login
   * Body: { email, password }
   * Backend sets httpOnly AccessToken and RefreshToken cookies.
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return ApiClient.post<AuthResponse>('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    });
  }

  /**
   * 2. POST /auth/register
   * Body: { firstName, lastName, email, password, phone, whatsappPhone?, roles }
   */
  static async register(data: RegisterData): Promise<any> {
    const payload: any = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phone: data.phone.trim(),
      roles: data.roles,
    };
    if (data.whatsappPhone && data.whatsappPhone.trim()) {
      payload.whatsappPhone = data.whatsappPhone.trim();
    }
    return ApiClient.post<any>('/auth/register', payload);
  }

  /**
   * 3. POST /auth/verify-otp
   * Body: { email, otp }
   */
  static async verifyOtp(data: VerifyOtpData): Promise<any> {
    return ApiClient.post<any>('/auth/verify-otp', {
      email: data.email.trim().toLowerCase(),
      otp: data.otp.trim(),
    });
  }

  /**
   * 4. POST /auth/resend-otp
   * Body: { email }
   */
  static async resendOtp(email: string): Promise<any> {
    return ApiClient.post<any>('/auth/resend-otp', {
      email: email.trim().toLowerCase(),
    });
  }

  /**
   * 5. POST /auth/logout
   * Clears server-side refresh token and removes cookies.
   */
  static async logout(): Promise<void> {
    try {
      await ApiClient.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthService] Logout request warning:', err);
    }
  }

  /**
   * 6. POST /auth/refresh-token
   * Reads RefreshToken cookie and issues new cookies.
   */
  static async refreshToken(): Promise<boolean> {
    try {
      await ApiClient.post('/auth/refresh-token');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 7. GET /profile/me
   * Fetches the current authenticated user profile.
   */
  static async getMe(): Promise<User> {
    const res = await ApiClient.get<any>('/profile/me');
    const profile = res?.data?.profile || res?.profile || res?.data || res;
    const user = profile?.user || profile;
    return {
      id: user?.id || profile?.userId,
      ...user,
      profile: profile,
      role:
        user?.role ||
        profile?.role ||
        (Array.isArray(user?.roles) ? user.roles[0] : null) ||
        (Array.isArray(profile?.roles) ? profile.roles[0] : null),
      roles: user?.roles || profile?.roles,
      userRoles: user?.userRoles || profile?.userRoles,
    } as User;
  }

  /**
   * 8. POST /auth/forget-password
   * Body: { email }
   */
  static async forgotPassword(email: string): Promise<any> {
    return ApiClient.post<any>('/auth/forget-password', {
      email: email.trim().toLowerCase(),
    });
  }

  /**
   * 9. POST /auth/reset-password
   * Body: { userId, resetToken, newPassword }
   */
  static async resetPassword(data: {
    userId: string;
    resetToken: string;
    newPassword: string;
  }): Promise<any> {
    return ApiClient.post<any>('/auth/reset-password', {
      userId: data.userId.trim(),
      resetToken: data.resetToken.trim(),
      newPassword: data.newPassword,
    });
  }

  /**
   * 10. DELETE /auth/delete
   * Deletes the authenticated user's own account.
   */
  static async deleteAccount(): Promise<any> {
    return ApiClient.delete<any>('/auth/delete');
  }
}

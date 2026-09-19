import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AuthService } from '../services/authService';
import type { User, LoginCredentials } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isTenant: boolean;
  isOwner: boolean;
  isAdmin: boolean;
}

export function extractUserRole(user: any): string | null {
  if (!user) return null;
  if (typeof user.role === 'string') return user.role.toLowerCase();
  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      if (typeof r === 'string') return r.toLowerCase();
      if (r?.name) return r.name.toLowerCase();
      if (r?.role?.name) return r.role.name.toLowerCase();
    }
  }
  if (Array.isArray(user.userRoles)) {
    for (const ur of user.userRoles) {
      if (ur?.role?.name) return ur.role.name.toLowerCase();
      if (ur?.name) return ur.name.toLowerCase();
    }
  }
  return null;
}

export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  const directRole = typeof user.role === 'string' ? user.role.toLowerCase() : null;
  if (directRole === 'admin' || directRole === 'super_admin' || directRole === 'superadmin') return true;

  if (Array.isArray(user.roles)) {
    for (const r of user.roles) {
      const str = typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase() || r?.role?.name?.toLowerCase();
      if (str === 'admin' || str === 'super_admin' || str === 'superadmin') return true;
    }
  }
  if (Array.isArray(user.userRoles)) {
    for (const ur of user.userRoles) {
      const str = ur?.role?.name?.toLowerCase() || ur?.name?.toLowerCase();
      if (str === 'admin' || str === 'super_admin' || str === 'superadmin') return true;
    }
  }
  return false;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    try {
      const userData = await AuthService.getMe();
      if (userData && userData.id) {
        setUser(userData);
        setRole(extractUserRole(userData));
      } else {
        setUser(null);
        setRole(null);
      }
    } catch {
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (credentials: LoginCredentials): Promise<User | null> => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(credentials);
      // Attempt to load full user details
      let authenticatedUser: User | null = res?.data?.user || res?.user || null;
      if (!authenticatedUser || !authenticatedUser.id) {
        try {
          authenticatedUser = await AuthService.getMe();
        } catch {
          // getMe fallback
        }
      }
      if (authenticatedUser && authenticatedUser.id) {
        setUser(authenticatedUser);
        setRole(extractUserRole(authenticatedUser));
      } else {
        await refreshUser();
      }
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } finally {
      setUser(null);
      setRole(null);
      setIsLoading(false);
    }
  };

  const isTenant = role === 'tenant';
  const isOwner = role === 'owner';
  const isAdmin = isUserAdmin(user) || role === 'admin' || role === 'super_admin' || role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
        isTenant,
        isOwner,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

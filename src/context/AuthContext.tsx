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
  const u = user.user || user.profile?.user || user;
  if (typeof u.role === 'string' && u.role) return u.role.toLowerCase();
  if (typeof user.role === 'string' && user.role) return user.role.toLowerCase();

  const rolesArr = u.roles || user.roles || u.userRoles || user.userRoles;
  if (Array.isArray(rolesArr)) {
    for (const r of rolesArr) {
      if (typeof r === 'string' && r) return r.toLowerCase();
      if (r?.name) return r.name.toLowerCase();
      if (r?.role?.name) return r.role.name.toLowerCase();
    }
  }

  // Fallback: If user has an ID, default to tenant
  return 'tenant';
}

export function isUserAdmin(user: any): boolean {
  if (!user) return false;
  const u = user.user || user.profile?.user || user;
  const directRole = typeof u.role === 'string' ? u.role.toLowerCase() : typeof user.role === 'string' ? user.role.toLowerCase() : null;
  if (directRole === 'admin' || directRole === 'super_admin' || directRole === 'superadmin') return true;

  const rolesArr = u.roles || user.roles || u.userRoles || user.userRoles;
  if (Array.isArray(rolesArr)) {
    for (const r of rolesArr) {
      const str = typeof r === 'string' ? r.toLowerCase() : r?.name?.toLowerCase() || r?.role?.name?.toLowerCase();
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

  const isTenant = role === 'tenant' || role === 'student' || role === 'user';
  const isOwner = role === 'owner' || role === 'landlord';
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

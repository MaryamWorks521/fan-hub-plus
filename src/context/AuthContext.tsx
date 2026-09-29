import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  [key: string]: any;
}

const API_BASE = 'http://localhost:3000';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; resetToken?: string; error?: string }>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: any) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('fanhub_token')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('fanhub_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Login failed'
        };
      }

      localStorage.setItem('fanhub_token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error during login'
      };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error || 'Registration failed'
        };
      }

      localStorage.setItem('fanhub_token', data.token);
      setToken(data.token);
      setUser(data.user);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Network error during registration'
      };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (e) {
        // Ignore logout request errors.
      }
    }

    localStorage.removeItem('fanhub_token');
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error
        };
      }

      return {
        success: true,
        resetToken: data.resetToken
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  const resetPassword = async (
    resetToken: string,
    newPassword: string
  ) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resetToken,
          newPassword
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error
        };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  const updateProfile = async (updates: any) => {
    if (!token) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }

    try {
      const res = await fetch(`${API_BASE}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: data.error
        };
      }

      setUser(data.user);

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile
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

export { AuthContext };
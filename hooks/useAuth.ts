import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'student' | 'freelancer' | 'admin' | 'guest';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  rememberedEmail: string;
  rememberMe: boolean;
  signIn: (email: string, password: string) => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  setRememberMe: (value: boolean) => void;
  setRememberedEmail: (value: string) => void;
  switchRole: (role: UserRole) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_USER = 'batseeku:user';
const STORAGE_REMEMBER = 'batseeku:remember';
const STORAGE_REMEMBER_EMAIL = 'batseeku:rememberEmail';

const MOCK_ACCOUNTS = [
  {
    email: 'student1@g.batstate-u.edu.ph',
    password: '123456',
    role: 'student' as UserRole,
    name: 'Juan Dela Cruz',
  },
  {
    email: 'tutor1@g.batstate-u.edu.ph',
    password: '123456',
    role: 'freelancer' as UserRole,
    name: 'Andrea Cruz',
  },
  {
    email: 'admin@g.batstate-u.edu.ph',
    password: 'admin123',
    role: 'admin' as UserRole,
    name: 'Admin Account',
  },
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberedEmail, setRememberedEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_USER);
        const storedRemember = await AsyncStorage.getItem(STORAGE_REMEMBER);
        const storedEmail = await AsyncStorage.getItem(STORAGE_REMEMBER_EMAIL);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedRemember) {
          setRememberMe(storedRemember === 'true');
        }
        if (storedEmail) {
          setRememberedEmail(storedEmail);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const persistRememberState = useCallback(async (nextRemember: boolean, nextEmail: string) => {
    await AsyncStorage.setItem(STORAGE_REMEMBER, String(nextRemember));
    if (nextRemember) {
      await AsyncStorage.setItem(STORAGE_REMEMBER_EMAIL, nextEmail);
    } else {
      await AsyncStorage.removeItem(STORAGE_REMEMBER_EMAIL);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const account = MOCK_ACCOUNTS.find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
      );

      if (!account) {
        return null;
      }

      const nextUser: AuthUser = {
        id: account.email,
        name: account.name,
        email: account.email,
        role: account.role,
      };

      setUser(nextUser);
      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
      await persistRememberState(rememberMe, email);
      return nextUser;
    },
    [persistRememberState, rememberMe]
  );

  const signOut = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_USER);
  }, []);

  const signInAsGuest = useCallback(async () => {
    const guestUser: AuthUser = {
      id: 'guest',
      name: 'Guest',
      email: 'guest@batseeku.app',
      role: 'guest',
    };
    setUser(guestUser);
    await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(guestUser));
  }, []);

  const switchRole = useCallback(
    async (newRole: UserRole) => {
      if (!user) return;
      const nextUser: AuthUser = { ...user, role: newRole };
      setUser(nextUser);
      await AsyncStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isLoading,
      rememberedEmail,
      rememberMe,
      signIn,
      signOut,
      signInAsGuest,
      setRememberMe,
      setRememberedEmail,
      switchRole,
    }),
    [
      user,
      isLoading,
      rememberedEmail,
      rememberMe,
      signIn,
      signOut,
      signInAsGuest,
      switchRole,
    ]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

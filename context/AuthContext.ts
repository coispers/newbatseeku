// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'student' | 'freelancer' | 'admin' | 'guest';

export type AuthUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

type AuthContextValue = {
    user: AuthUser | null;
    session: Session | null;
    isLoading: boolean;
    rememberedEmail: string;
    rememberMe: boolean;
    signIn: (email: string, password: string) => Promise<AuthUser | null>;
    signUp: (email: string, password: string, fullName: string, role: UserRole, program: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    setRememberMe: (value: boolean) => void;
    setRememberedEmail: (value: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_REMEMBER = 'batseeku:remember';
const STORAGE_REMEMBER_EMAIL = 'batseeku:rememberEmail';

type FreelancerProfileRow = {
    id: string;
    full_name: string;
    avatar: string;
    course: string;
    university: string;
    is_verified: boolean;
    is_top_tutor: boolean;
    rating: number;
    completed_jobs: number;
    response_rate: number;
    member_since: number;
    campus_reputation: number;
    about: string;
    expertise: string;
    portfolio: null;
    base_price: number;
};

const buildFreelancerProfile = (userId: string, fullName: string, university: string): FreelancerProfileRow => {
    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return {
        id: userId,
        full_name: fullName,
        avatar: initials || 'FT',
        course: 'BS Computer Science',
        university,
        is_verified: true,
        is_top_tutor: true,
        rating: 4.9,
        completed_jobs: 128,
        response_rate: 96,
        member_since: 2026,
        campus_reputation: 92,
        about: 'Experienced student freelancer ready to help you succeed!',
        expertise: JSON.stringify(['Programming', 'Math', 'Thesis']),
        portfolio: null,
        base_price: 180,
    };
};

const ensureFreelancerProfile = async (userId: string, fullName: string, university: string) => {
    const profile = buildFreelancerProfile(userId, fullName, university);
    const { error } = await supabase.from('freelancer_profiles').upsert(profile, {
        onConflict: 'id',
    });

    return error ? error.message : null;
};

const toAuthUser = (user: User): AuthUser => ({
    id: user.id,
    email: user.email ?? '',
    name: user.user_metadata?.full_name ?? user.email ?? '',
    role: (user.user_metadata?.role as UserRole) ?? 'student',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [rememberedEmail, setRememberedEmail] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        let isActive = true;

        const loadSession = async () => {
            try {
                const [storedRemember, storedEmail, { data }] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_REMEMBER),
                    AsyncStorage.getItem(STORAGE_REMEMBER_EMAIL),
                    supabase.auth.getSession(),
                ]);

                if (!isActive) return;

                if (storedRemember) {
                    setRememberMe(storedRemember === 'true');
                }
                if (storedEmail) {
                    setRememberedEmail(storedEmail);
                }

                const nextSession = data.session ?? null;
                setSession(nextSession);
                setUser(nextSession?.user ? toAuthUser(nextSession.user) : null);

                if (nextSession?.user?.user_metadata?.role === 'freelancer') {
                    const university = nextSession.user.user_metadata?.university || 'Batangas State University';
                    const profileError = await ensureFreelancerProfile(
                        nextSession.user.id,
                        nextSession.user.user_metadata?.full_name ?? nextSession.user.email ?? 'Freelancer',
                        university
                    );

                    if (profileError) {
                        console.error('Failed to ensure freelancer profile:', profileError);
                    }
                }
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        };

        loadSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession);
            setUser(nextSession?.user ? toAuthUser(nextSession.user) : null);
            setIsLoading(false);

            if (nextSession?.user?.user_metadata?.role === 'freelancer') {
                const university = nextSession.user.user_metadata?.university || 'Batangas State University';
                ensureFreelancerProfile(
                    nextSession.user.id,
                    nextSession.user.user_metadata?.full_name ?? nextSession.user.email ?? 'Freelancer',
                    university
                ).catch((error) => {
                    console.error('Failed to ensure freelancer profile after auth change:', error);
                });
            }
        });

        return () => {
            isActive = false;
            subscription.unsubscribe();
        };
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
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error || !data.user) {
                return null;
            }

            const nextUser = toAuthUser(data.user);
            setUser(nextUser);
            setSession(data.session ?? null);
            await persistRememberState(rememberMe, email);
            return nextUser;
        },
        [persistRememberState, rememberMe]
    );

    const signUp = useCallback(
        async (email: string, password: string, fullName: string, role: UserRole, program: string) => {
            const normalizedEmail = email.trim().toLowerCase();
            const trimmedName = fullName.trim();
            const trimmedProgram = program.trim();

            if (!normalizedEmail.endsWith('@g.batstate-u.edu.ph')) {
                return { error: 'Must use a university email (@g.batstate-u.edu.ph)' };
            }

            if (!trimmedName) {
                return { error: 'Please enter your full name.' };
            }

            if (!password) {
                return { error: 'Please enter a password.' };
            }

            const metadata: Record<string, string> = {
                full_name: trimmedName,
                role,
            };

            if (trimmedProgram) {
                metadata.program = trimmedProgram;
            }

            // Register user
            const { data, error } = await supabase.auth.signUp({
                email: normalizedEmail,
                password,
                options: {
                    data: metadata,
                },
            });

            if (error || !data.user) {
                return { error: error ? error.message : 'Registration failed' };
            }

            // If freelancer, create profile
            if (role === 'freelancer') {
                const university = data.user.user_metadata?.university || 'Batangas State University';
                const profileError = await ensureFreelancerProfile(data.user.id, trimmedName, university);

                if (profileError) {
                    return { error: profileError };
                }
            }

            return { error: null };
        },
        []
    );

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
    }, []);

    const signInAsGuest = useCallback(async () => {
        const guestUser: AuthUser = {
            id: 'guest',
            name: 'Guest',
            email: 'guest@batseeku.app',
            role: 'guest',
        };
        setUser(guestUser);
        setSession(null);
    }, []);

    const value = useMemo(
        () => ({
            user,
            session,
            isLoading,
            rememberedEmail,
            rememberMe,
            signIn,
            signUp,
            signOut,
            signInAsGuest,
            setRememberMe,
            setRememberedEmail,
        }),
        [
            user,
            session,
            isLoading,
            rememberedEmail,
            rememberMe,
            signIn,
            signUp,
            signOut,
            signInAsGuest,
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
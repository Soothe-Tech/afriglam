import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

type SignInArgs = {
  email: string;
  password: string;
};

type SignUpArgs = {
  email: string;
  password: string;
  name?: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  authEnabled: boolean;
  signIn: (args: SignInArgs) => Promise<{ error?: string }>;
  signUp: (args: SignUpArgs) => Promise<{ error?: string }>;
  signInWithProvider: (provider: 'google' | 'apple') => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL_SUFFIX = '@afriglam.com';

const getAdminStatus = (user: User | null, roleFromProfile: string | null): boolean => {
  if (!user) return false;
  const explicitRole = roleFromProfile ?? user.user_metadata?.role;
  if (explicitRole === 'ADMIN') return true;
  return (user.email ?? '').toLowerCase().endsWith(ADMIN_EMAIL_SUFFIX);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfileRole = async (userId: string | undefined) => {
    if (!userId || !supabase) {
      setProfileRole(null);
      return;
    }
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    setProfileRole((data?.role as string | undefined) ?? null);
  };

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      void refreshProfileRole(data.session?.user?.id);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      void refreshProfileRole(nextSession?.user?.id);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async ({ email, password }: SignInArgs) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp = async ({ email, password, name }: SignUpArgs) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'CUSTOMER',
        },
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const signInWithProvider = async (provider: 'google' | 'apple') => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isAdmin: getAdminStatus(user, profileRole),
      loading,
      authEnabled: isSupabaseConfigured,
      signIn,
      signUp,
      signInWithProvider,
      resetPassword,
      signOut,
    }),
    [loading, profileRole, session, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

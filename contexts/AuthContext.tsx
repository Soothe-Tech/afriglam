import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { isRuntimeDemoMode, isSupabaseConfigured, supabase } from '../lib/supabase';

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
const DEMO_AUTH_KEY = 'afriglam_demo_auth';

const getAdminStatus = (user: User | null, roleFromProfile: string | null): boolean => {
  if (!user) return false;
  const explicitRole = roleFromProfile ?? user.user_metadata?.role;
  return explicitRole === 'ADMIN';
};

const buildDemoSession = (args: { email: string; role: 'ADMIN' | 'CUSTOMER'; name?: string }) => {
  const user = {
    id: `demo-${args.role.toLowerCase()}-${args.email}`,
    email: args.email,
    user_metadata: {
      full_name: args.name ?? args.email.split('@')[0],
      name: args.name ?? args.email.split('@')[0],
      role: args.role,
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as unknown as User;

  const session = {
    access_token: `demo-token-${args.email}`,
    token_type: 'bearer',
    user,
  } as unknown as Session;

  return { user, session, role: args.role };
};

const loadDemoSession = () => {
  const raw = localStorage.getItem(DEMO_AUTH_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email: string; role: 'ADMIN' | 'CUSTOMER'; name?: string };
    return buildDemoSession(parsed);
  } catch {
    return null;
  }
};

const saveDemoSession = (payload: { email: string; role: 'ADMIN' | 'CUSTOMER'; name?: string }) => {
  localStorage.setItem(DEMO_AUTH_KEY, JSON.stringify(payload));
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfileRole = async (userId: string | undefined) => {
    if (isRuntimeDemoMode) {
      const demo = loadDemoSession();
      setProfileRole(demo?.role ?? null);
      return;
    }

    if (!userId || !supabase) {
      setProfileRole(null);
      return;
    }
    const { data } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
    setProfileRole((data?.role as string | undefined) ?? null);
  };

  useEffect(() => {
    if (isRuntimeDemoMode) {
      const demo = loadDemoSession();
      setSession(demo?.session ?? null);
      setUser(demo?.user ?? null);
      setProfileRole(demo?.role ?? null);
      setLoading(false);
      return;
    }

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
    if (isRuntimeDemoMode) {
      if (!email || !password) return { error: 'Email and password are required.' };
      const role = email.toLowerCase().includes('admin') ? 'ADMIN' : 'CUSTOMER';
      const demo = buildDemoSession({ email, role });
      saveDemoSession({ email, role });
      setSession(demo.session);
      setUser(demo.user);
      setProfileRole(role);
      return {};
    }

    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUp = async ({ email, password, name }: SignUpArgs) => {
    if (isRuntimeDemoMode) {
      if (!email || !password) return { error: 'Email and password are required.' };
      const demo = buildDemoSession({ email, role: 'CUSTOMER', name });
      saveDemoSession({ email, role: 'CUSTOMER', name });
      setSession(demo.session);
      setUser(demo.user);
      setProfileRole('CUSTOMER');
      return {};
    }

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
    if (isRuntimeDemoMode) {
      const email = provider === 'google' ? 'google-demo@afriglam.local' : 'apple-demo@afriglam.local';
      const demo = buildDemoSession({ email, role: 'CUSTOMER', name: `${provider} demo` });
      saveDemoSession({ email, role: 'CUSTOMER', name: `${provider} demo` });
      setSession(demo.session);
      setUser(demo.user);
      setProfileRole('CUSTOMER');
      return {};
    }

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
    if (isRuntimeDemoMode) {
      if (!email) return { error: 'Email is required.' };
      return {};
    }

    if (!supabase) return { error: 'Supabase is not configured.' };
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => {
    if (isRuntimeDemoMode) {
      localStorage.removeItem(DEMO_AUTH_KEY);
      setSession(null);
      setUser(null);
      setProfileRole(null);
      return;
    }

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

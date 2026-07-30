import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithRole = async (session) => {
    if (!session?.user) {
      setUser(null);
      return;
    }
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', session.user.id)
      .single();

    setUser({
      id: session.user.id,
      email: session.user.email,
      name: profile?.full_name || session.user.email.split('@')[0],
      role: roleData?.role || 'user',
      isVerified: session.user.email_confirmed_at != null
    });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchUserWithRole(session).finally(() => setLoading(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserWithRole(session).finally(() => setLoading(false));
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      throw { message: error.message };
    }
    await fetchUserWithRole(data.session);
    setLoading(false);
    return { success: true, message: 'Login successful' };
  };

  const register = async (name, email, password) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    setLoading(false);
    if (error) throw { message: error.message };
    return { success: true, message: 'Registration successful! You can now log in.' };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

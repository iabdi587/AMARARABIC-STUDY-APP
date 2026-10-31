import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { Session } from '@supabase/supabase-js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authConfigured, supabase } from './supabase';
import type { SyncStatus } from '../progress/engine';

type Props = { visible: boolean; close(): void; session: Session | null; status: SyncStatus; pending: number; signOut(): Promise<void>; deleteAccount(): Promise<void>; retry(): void };

export function AccountModal({ visible, close, session, status, pending, signOut, deleteAccount, retry }: Props) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failure, setFailure] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (!visible) {
      setEmail('');
      setPassword('');
      setFailure('');
      setMessage('');
      setDeleting(false);
      setConfirmation('');
      setMode('signin');
    }
  }, [visible]);

  useEffect(() => {
    if (session) {
      setPassword('');
      setMessage('');
    }
  }, [session?.user.id]);

  const run = async (task: () => Promise<void>) => {
    setBusy(true);
    setFailure('');
    setMessage('');
    try {
      await task();
    } catch (error) {
      const detail = error instanceof Error ? error.message : '';
      if (/invalid login credentials/i.test(detail)) {
        setFailure('Incorrect email or password.');
      } else if (/already registered/i.test(detail) || /user already exists/i.test(detail)) {
        setFailure('An account with this email already exists. Click "Sign in" below.');
      } else if (/password should be at least/i.test(detail)) {
        setFailure('Password should be at least 6 characters.');
      } else {
        setFailure(detail || 'We could not complete that request. Check your connection and try again.');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = () => run(async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFailure('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFailure('Password must be at least 6 characters.');
      return;
    }
    if (!supabase) return;

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
      });
      if (error) throw error;
      if (data.session) {
        setMessage('Account created! Your study progress will sync automatically.');
      } else {
        setMessage('Account created! You can now sign in.');
        setMode('signin');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) throw error;
      setMessage('Signed in! Your progress will sync automatically.');
    }
  });

  function Action({ label, onPress, secondary = false, disabled = false }: { label: string; onPress(): void; secondary?: boolean; disabled?: boolean }) {
    return (
      <Pressable
        accessibilityRole="button"
        disabled={busy || disabled}
        onPress={onPress}
        style={[s.button, secondary && s.secondary, (busy || disabled) && { opacity: 0.5 }]}
      >
        <Text style={[s.buttonText, secondary && { color: '#f5f4ef' }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!busy) close(); }}>
      <View style={s.shade}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.scroll}>
          <View style={s.card}>
            <View style={s.headingRow}>
              <View>
                <Text style={s.eyebrow}>YOUR STUDY ACCOUNT</Text>
                <Text accessibilityRole="header" style={s.title}>
                  {session ? 'Your progress, with you.' : mode === 'signin' ? 'Sign in to sync.' : 'Create an account.'}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Close account" disabled={busy} onPress={close} style={{ padding: 8 }}>
                <Ionicons name="close" size={23} color="#9aadb9" />
              </Pressable>
            </View>

            {!authConfigured ? (
              <>
                <Text style={s.body}>Account sign-in is being set up. You can keep studying and saving progress on this device.</Text>
                <Action label="Continue studying" onPress={close} />
              </>
            ) : session ? (
              <>
                <Text style={s.email}>{session.user.email}</Text>
                <View style={s.sync}>
                  <Ionicons name={status === 'synced' ? 'cloud-done-outline' : 'cloud-upload-outline'} size={22} color="#6EC1D6" />
                  <Text style={[s.body, { flex: 1, marginVertical: 0 }]}>
                    {status === 'synced' ? 'Your progress is up to date.' : status === 'offline' ? 'Saved on this device. We will retry syncing when you reconnect.' : 'Syncing your progress…'}
                    {pending > 0 ? ` ${pending} ${pending === 1 ? 'change' : 'changes'} waiting.` : ''}
                  </Text>
                </View>
                {status === 'offline' && <Action label="Try syncing again" secondary onPress={retry} />}
                <Action label="Sign out" secondary onPress={() => run(signOut)} />
                <Text style={s.small}>Signing out keeps your account’s progress separate from guest study. Any changes waiting to sync stay on this device for your next sign-in.</Text>
                {deleting ? (
                  <View style={s.deleteBox}>
                    <Text style={s.body}>Delete your account and all synced progress permanently? This cannot be undone. Type DELETE to confirm.</Text>
                    <TextInput accessibilityLabel="Confirm account deletion" value={confirmation} onChangeText={setConfirmation} autoCapitalize="characters" autoCorrect={false} placeholder="DELETE" placeholderTextColor="#9aadb9" style={s.input} />
                    <Action label="Permanently delete account" disabled={confirmation !== 'DELETE'} onPress={() => run(async () => { await deleteAccount(); close(); })} />
                    <Action label="Keep my account" secondary onPress={() => { setDeleting(false); setConfirmation(''); }} />
                  </View>
                ) : (
                  <Pressable accessibilityRole="button" disabled={busy} onPress={() => setDeleting(true)} style={{ paddingVertical: 16 }}>
                    <Text style={s.deleteText}>Delete my account</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <Text style={s.body}>
                  {mode === 'signin'
                    ? 'Sign in with your email and password to sync your learned words and bookmarks across devices.'
                    : 'Create an account with your email and password. Your progress will follow you everywhere.'}
                </Text>

                <Text style={s.label}>Email address</Text>
                <TextInput
                  accessibilityLabel="Account email address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#9aadb9"
                  style={s.input}
                  editable={!busy}
                />

                <View style={s.passwordHeader}>
                  <Text style={s.label}>Password</Text>
                  <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                    <Text style={s.togglePassword}>{showPassword ? 'Hide' : 'Show'}</Text>
                  </Pressable>
                </View>
                <TextInput
                  accessibilityLabel="Account password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={!showPassword}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  textContentType={mode === 'signin' ? 'password' : 'newPassword'}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={mode === 'signin' ? 'Enter your password' : 'At least 6 characters'}
                  placeholderTextColor="#9aadb9"
                  style={s.input}
                  editable={!busy}
                  onSubmitEditing={handleSubmit}
                />

                <Action
                  label={mode === 'signin' ? 'Sign in' : 'Create account'}
                  onPress={handleSubmit}
                />

                <Pressable
                  accessibilityRole="button"
                  disabled={busy}
                  onPress={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setFailure('');
                    setMessage('');
                  }}
                  style={{ paddingVertical: 12 }}
                >
                  <Text style={s.link}>
                    {mode === 'signin'
                      ? "Don't have an account? Create one"
                      : 'Already have an account? Sign in'}
                  </Text>
                </Pressable>

                <Text style={s.small}>
                  Your existing guest progress will be saved to your account automatically upon signing in.
                </Text>

                <Pressable accessibilityRole="button" disabled={busy} onPress={close} style={{ paddingVertical: 12 }}>
                  <Text style={s.link}>Continue as a guest</Text>
                </Pressable>
              </>
            )}

            {busy && <ActivityIndicator color="#ED8C44" style={{ marginTop: 14 }} />}
            {!!failure && <Text accessibilityRole="alert" style={s.error}>{failure}</Text>}
            {!!message && <Text accessibilityRole="alert" style={s.success}>{message}</Text>}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  shade: { flex: 1, backgroundColor: '#000b', padding: 20 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', maxWidth: 520, padding: 25, backgroundColor: '#0F1829', borderWidth: 1, borderColor: '#294151', borderRadius: 14 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  eyebrow: { fontSize: 9, letterSpacing: 1.5, color: '#ED8C44' },
  title: { color: '#f5f4ef', fontSize: 25, marginTop: 10, fontWeight: '600' },
  body: { color: '#9aadb9', fontSize: 13, lineHeight: 22, marginVertical: 18 },
  label: { color: '#f5f4ef', fontSize: 12, marginBottom: 9 },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 },
  togglePassword: { color: '#6EC1D6', fontSize: 12 },
  input: { borderWidth: 1, borderColor: '#294151', borderRadius: 7, padding: 14, fontSize: 16, color: '#f5f4ef', marginBottom: 16 },
  button: { backgroundColor: '#ED8C44', borderRadius: 7, padding: 14, alignItems: 'center', marginBottom: 10 },
  secondary: { backgroundColor: '#152535', borderWidth: 1, borderColor: '#294151' },
  buttonText: { color: '#0F1829', fontSize: 13, fontWeight: '600' },
  link: { color: '#6EC1D6', fontSize: 13, textAlign: 'center' },
  small: { color: '#9aadb9', fontSize: 11, lineHeight: 19, marginTop: 12 },
  email: { color: '#f5f4ef', fontSize: 14, marginTop: 20 },
  sync: { backgroundColor: '#152535', padding: 15, borderRadius: 7, flexDirection: 'row', gap: 12, alignItems: 'center', marginVertical: 20 },
  deleteBox: { marginTop: 20, borderTopWidth: 1, borderColor: '#294151' },
  deleteText: { color: '#ed8c44', fontSize: 12 },
  error: { color: '#ffb4a9', fontSize: 13, lineHeight: 21, marginTop: 12 },
  success: { color: '#9cceb0', fontSize: 13, lineHeight: 21, marginTop: 12 },
});

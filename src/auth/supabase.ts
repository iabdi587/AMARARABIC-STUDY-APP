import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { createClient, processLock } from '@supabase/supabase-js';
import { projectConfig } from './projectConfig';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL || projectConfig.url;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || projectConfig.publishableKey;
export const authConfigured = Boolean(url && key);
export const supabase = url && key ? createClient(url, key, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: AsyncStorage, lock: processLock } : {}),
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) : null;

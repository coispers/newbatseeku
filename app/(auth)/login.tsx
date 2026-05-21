import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

const EMAIL_DOMAIN = '@g.batstate-u.edu.ph';

const LoginScreen = () => {
  const router = useRouter();
  const {
    signIn,
    signInAsGuest,
    rememberMe,
    rememberedEmail,
    setRememberMe,
    setRememberedEmail,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
    }
  }, [rememberedEmail]);

  const isValidDomain = (value: string) => value.toLowerCase().endsWith(EMAIL_DOMAIN);

  const handleLogin = async () => {
    setError('');

    if (!isValidDomain(email)) {
      setError(`Use your ${EMAIL_DOMAIN} email.`);
      return;
    }

    const user = await signIn(email, password);
    if (!user) {
      setError('Incorrect email or password.');
      return;
    }

    router.replace(user.role === 'admin' ? '/admin' : '/(tabs)');
  };

  const handleGuest = async () => {
    await signInAsGuest();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>BatSeekU</Text>
          <Text style={styles.tagline}>Batangas State University</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Log In</Text>

          <TextInput
            placeholder="student@g.batstate-u.edu.ph"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setRememberedEmail(value);
            }}
          />
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              onPress={() => setShowPassword((prev) => !prev)}
              style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={18}
                color={Colors.textMuted}
              />
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remember me"
            onPress={() => setRememberMe(!rememberMe)}
            style={({ pressed }) => [styles.rememberRow, pressed && styles.pressed]}
          >
            <Ionicons
              name={rememberMe ? 'checkbox-outline' : 'square-outline'}
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <Button label="Log In" onPress={handleLogin} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Forgot password"
            onPress={() => router.push('/(auth)/forgot-password')}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.line} />
          </View>

          <Button label="Continue as Guest" variant="ghost" onPress={handleGuest} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Register"
            onPress={() => router.push('/(auth)/register')}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkText}>Create an account</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.primary,
  },
  tagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.lg,
    ...(Shadow || {}),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  rememberText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  error: {
    color: Colors.primaryDark,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  link: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: Spacing.sm,
    color: Colors.textMuted,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default LoginScreen;

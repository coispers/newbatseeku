import React, { useState } from 'react';
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

const RegisterScreen = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<'student' | 'freelancer'>('student');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [course, setCourse] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    if (!acceptedTerms) {
      setError('Please accept the terms and privacy policy.');
      return;
    }

    if (!trimmedName) {
      setError('Please enter your full name.');
      return;
    }

    if (!normalizedEmail) {
      setError('Please enter your university email.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const result = await signUp(normalizedEmail, password, trimmedName, role, course);
    if (result.error) {
      setError(result.error);
      return;
    }

    router.replace('/(auth)/login');
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
          <Text style={styles.title}>Create Account</Text>

          <TextInput
            placeholder="Full name"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            placeholder="University email"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm password"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TextInput
            placeholder="Course / program"
            placeholderTextColor={Colors.textMuted}
            style={styles.input}
            value={course}
            onChangeText={setCourse}
          />

          <View style={styles.roleRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select student"
              onPress={() => setRole('student')}
              style={({ pressed }) => [styles.rolePill, role === 'student' && styles.roleSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.roleText, role === 'student' && styles.roleSelectedText]}>Student</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select freelancer"
              onPress={() => setRole('freelancer')}
              style={({ pressed }) => [styles.rolePill, role === 'freelancer' && styles.roleSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.roleText, role === 'freelancer' && styles.roleSelectedText]}>Freelancer</Text>
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Accept terms"
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            style={({ pressed }) => [styles.termsRow, pressed && styles.pressed]}
          >
            <Ionicons
              name={acceptedTerms ? 'checkbox-outline' : 'square-outline'}
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.termsText}>I accept the terms and privacy policy</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button label="Create Account" onPress={handleRegister} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to login"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.link, pressed && styles.pressed]}
          >
            <Text style={styles.linkText}>Back to login</Text>
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
  roleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  rolePill: {
    flex: 1,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  roleSelectedText: {
    color: Colors.white,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
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
  pressed: {
    opacity: 0.7,
  },
});

export default RegisterScreen;

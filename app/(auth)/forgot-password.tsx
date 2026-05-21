import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText as Text } from '../../components/ui/AppText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Colors } from '../../constants/colors';
import { Radius, Shadow, Spacing } from '../../constants/theme';
import { Button } from '../../components/ui/Button';

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>We will send a reset link to your university email.</Text>

          <TextInput
            placeholder="student@g.batstate-u.edu.ph"
            placeholderTextColor={Colors.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <Button label="Send Reset Link" onPress={() => setSent(true)} />

          {sent && (
            <View style={styles.successCard}>
              <Text style={styles.successTitle}>Link sent</Text>
              <Text style={styles.successText}>Check your inbox for the reset instructions.</Text>
            </View>
          )}

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
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  successCard: {
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  successText: {
    marginTop: Spacing.xs,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  link: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ForgotPasswordScreen;

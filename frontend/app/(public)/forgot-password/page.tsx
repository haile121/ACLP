'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useDialog } from '@/components/ui/DialogProvider';
import { authApi } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { show } = useDialog();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      setEmailError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError(undefined);
    setLoading(true);
    try {
      await authApi.forgotPassword(emailTrimmed);
      setSent(true);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Could not send reset email. Please try again.';
      show({ variant: 'error', title: 'Request failed', message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar variant="public" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-card border border-gray-200 dark:border-gray-800 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Forgot password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter your account email and we&apos;ll send a link to reset your password.
          </p>

          {sent ? (
            <div className="space-y-4" role="status">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                If an account exists for <strong className="font-medium">{email.trim()}</strong>, you will receive an
                email with reset instructions shortly. The link expires in one hour.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Check your spam folder. In local development without SMTP, the reset link is printed in the backend
                console.
              </p>
              <Link
                href="/sign-in"
                className="inline-block text-sm text-accent dark:text-accent-dark font-medium hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                autoComplete="email"
              />
              <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
                Send reset link
              </Button>
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Link href="/sign-in" className="text-accent dark:text-accent-dark font-medium hover:underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

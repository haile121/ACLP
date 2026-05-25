'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useDialog } from '@/components/ui/DialogProvider';
import { authApi } from '@/lib/api';

const MIN_PASSWORD_LENGTH = 8;

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { show } = useDialog();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!password) next.password = 'Password is required';
    else if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    if (!confirmPassword) next.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match';
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    if (!token) {
      show({
        variant: 'error',
        title: 'Invalid link',
        message: 'This reset link is missing or invalid. Request a new one from the sign-in page.',
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      show({
        variant: 'success',
        title: 'Password updated',
        message: 'You can now sign in with your new password.',
        autoDismissMs: 2500,
      });
      router.push('/sign-in');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string; code?: string } } };
      const message = ax.response?.data?.error ?? 'Could not reset password. Please try again.';
      show({ variant: 'error', title: 'Reset failed', message });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This reset link is invalid or incomplete. Request a new link below.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block text-sm text-accent dark:text-accent-dark font-medium hover:underline"
        >
          Request reset link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="relative">
        <Input
          label="New password"
          type={showPassword ? 'text' : 'password'}
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <div className="relative">
        <Input
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label={showConfirm ? 'Hide password' : 'Show password'}
        >
          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2 w-full">
        Update password
      </Button>
      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        <Link href="/sign-in" className="text-accent dark:text-accent-dark font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar variant="public" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 pt-16">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-card border border-gray-200 dark:border-gray-800 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Set a new password</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Choose a strong password for your account.</p>
          <Suspense
            fallback={
              <div className="flex justify-center py-8">
                <Spinner size="lg" />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}

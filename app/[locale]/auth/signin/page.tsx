'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export default function SignInPage({ params }: { params: { locale: string } }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="bg-white rounded-2xl border p-6 w-full max-w-md">
        <h1 className="text-lg font-semibold">Sign in</h1>
        {err && <div className="mt-2 p-2 text-sm bg-red-50 text-red-700 rounded">{err}</div>}
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErr(null);
            const res = await signIn('credentials', { email, password, redirect: false });
            if (res?.error) setErr(res.error === 'EMAIL_NOT_VERIFIED' ? 'Please verify your email first.' : 'Invalid credentials');
            else window.location.href = `/${params.locale}/resumes`;
          }}
        >
          <input
            placeholder="Email"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            className="w-full rounded-xl border px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full px-4 py-2 rounded-xl bg-brand-700 text-white text-sm">
            Sign in
          </button>
        </form>
        <div className="mt-3">
          <button
            className="w-full px-4 py-2 rounded-xl border text-sm"
            onClick={async () => {
              await signIn('google', { callbackUrl: `/${params.locale}/resumes` });
            }}
          >
            Continue with Google
          </button>
        </div>
        <div className="mt-3 text-sm text-slate-600">
          No account?{' '}
          <Link className="text-brand-700" href={`/${params.locale}/auth/signup`}>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

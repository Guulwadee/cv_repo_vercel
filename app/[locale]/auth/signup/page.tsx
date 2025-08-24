'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function SignUpPage({ params }: { params: { locale: string } }) {
  const [state, setState] = useState<{ error?: string; ok?: boolean }>({});
  return (
    <div className="min-h-screen grid place-items-center bg-slate-50">
      <div className="bg-white rounded-2xl border p-6 w-full max-w-md">
        <h1 className="text-lg font-semibold">Create account</h1>
        {state.error && <div className="mt-2 p-2 text-sm bg-red-50 text-red-700 rounded">{state.error}</div>}
        {state.ok && (
          <div className="mt-2 p-2 text-sm bg-green-50 text-green-700 rounded">
            Check your email to verify and then sign in.
          </div>
        )}
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget as HTMLFormElement);
            const payload = Object.fromEntries(fd.entries());
            const res = await fetch('/api/auth/signup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) setState({ error: data.error || 'Error signing up' });
            else setState({ ok: true });
          }}
        >
          <input name="name" placeholder="Full name" className="w-full rounded-xl border px-3 py-2 text-sm" />
          <input name="email" placeholder="Email" className="w-full rounded-xl border px-3 py-2 text-sm" />
          <input type="password" name="password" placeholder="Password (min 8 chars)" className="w-full rounded-xl border px-3 py-2 text-sm" />
          <button className="w-full px-4 py-2 rounded-xl bg-brand-700 text-white text-sm">
            Sign up
          </button>
        </form>
        <div className="mt-3 text-sm text-slate-600">
          Have an account?{' '}
          <Link className="text-brand-700" href={`/${params.locale}/auth/signin`}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

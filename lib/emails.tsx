import React from 'react';
import ReactDOMServer from 'react-dom/server';

export function renderEmail(children: React.ReactNode) {
  const html = ReactDOMServer.renderToStaticMarkup(
    <html>
      <body style={{ fontFamily: 'Inter, Arial, sans-serif', background: '#f6f7fb', padding: 24 }}>
        <div style={{ maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
          {children}
          <p style={{ color: '#6b7280', fontSize: 12, marginTop: 24 }}>
            © {new Date().getFullYear()} CV Builder
          </p>
        </div>
      </body>
    </html>
  );
  return '<!DOCTYPE html>' + html;
}

export function VerificationEmail({ name, verifyUrl }: { name?: string | null; verifyUrl: string }) {
  return (
    <>
      <h1 style={{ color: '#111827' }}>Verify your email</h1>
      <p style={{ color: '#374151' }}>
        Hi {name ?? 'there'}, please verify your email to activate your account.
      </p>
      <a
        href={verifyUrl}
        style={{
          display: 'inline-block',
          padding: '10px 16px',
          background: '#1d4ed8',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: 8,
          marginTop: 12
        }}
      >
        Verify Email
      </a>
    </>
  );
}

export function ReceiptEmail({
  name,
  amount,
  currency
}: {
  name?: string | null;
  amount: number;
  currency: string;
}) {
  return (
    <>
      <h1 style={{ color: '#111827' }}>Payment receipt</h1>
      <p style={{ color: '#374151' }}>Hi {name ?? 'there'}, thanks for upgrading to Pro.</p>
      <p>
        Amount: <strong>{(amount / 100).toFixed(2)} {currency}</strong>
      </p>
    </>
  );
}

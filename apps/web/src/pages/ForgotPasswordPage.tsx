import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/auth';

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const response = await forgotPassword(identifier);
      setToken(response.data.resetToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-black">Forgot password</h1>
      <p className="text-sm text-muted">Enter your phone number or email address. In this dev build we show a reset code directly.</p>
      <form onSubmit={handle} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <label className="block text-sm">
          <span>Phone or email</span>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-2 w-full rounded-2xl border border-border px-4 py-3" />
        </label>
        <button className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white">Send reset code</button>
      </form>
      {token ? (
        <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-muted">Reset code:</p>
          <p className="break-all rounded-xl bg-background px-4 py-3 text-sm font-mono">{token}</p>
          <button onClick={() => navigate(`/reset-password?token=${encodeURIComponent(token)}`)} className="rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white">
            Continue to reset password
          </button>
        </div>
      ) : null}
      <p className="text-sm"><Link to="/login" className="text-accent">Back to sign in</Link></p>
    </div>
  );
}

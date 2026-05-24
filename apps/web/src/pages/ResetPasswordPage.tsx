import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/auth';
import { inputFieldClass } from '../components/forms/inputStyles';

function useQueryToken() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get('token') ?? '', [search]);
}

export default function ResetPasswordPage() {
  const initialToken = useQueryToken();
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await resetPassword(token, password);
      setDone(true);
      window.setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-black">Reset password</h1>
      <form onSubmit={handle} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        {done ? <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700">Password updated.</div> : null}
        <label className="block text-sm">
          <span>Reset token</span>
          <input value={token} onChange={(e) => setToken(e.target.value)} className={inputFieldClass} />
        </label>
        <label className="block text-sm">
          <span>New password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputFieldClass} />
        </label>
        <label className="block text-sm">
          <span>Confirm password</span>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputFieldClass} />
        </label>
        <button className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white">Update password</button>
      </form>
      <p className="text-sm"><Link to="/login" className="text-accent">Back to sign in</Link></p>
    </div>
  );
}

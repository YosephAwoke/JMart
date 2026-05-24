import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { inputFieldClass } from '../components/forms/inputStyles';

export default function LoginPage() {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(phone, password);
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-black">Sign in to your account</h1>
      <form onSubmit={handle} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <label className="block text-sm">
          <span>Phone or email</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputFieldClass}
            placeholder="+251900000000"
          />
        </label>
        <label className="block text-sm">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputFieldClass}
            placeholder="Enter your password"
          />
        </label>
        <button className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white">Sign in</button>
      </form>
      <div className="flex items-center justify-between text-sm">
        <p>Don’t have an account? <Link to="/register" className="text-accent">Create one</Link></p>
        <Link to="/forgot-password" className="text-accent">Forgot password?</Link>
      </div>
    </div>
  );
}

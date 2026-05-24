import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { inputFieldClass } from '../components/forms/inputStyles';

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register({ fullName, phone, password, email });
      navigate('/account');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-3xl font-black">Create an account</h1>
      <form onSubmit={handle} className="space-y-4 rounded-2xl border border-border bg-surface p-6">
        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        <label className="block text-sm">
          <span>Full name</span>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputFieldClass}
            placeholder="Your full name"
          />
        </label>
        <label className="block text-sm">
          <span>Phone</span>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputFieldClass}
            placeholder="+251900000000"
          />
        </label>
        <label className="block text-sm">
          <span>Email (optional)</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputFieldClass}
            placeholder="name@example.com"
          />
        </label>
        <label className="block text-sm">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputFieldClass}
            placeholder="Create a password"
          />
        </label>
        <button className="w-full rounded-full bg-accent px-4 py-3 font-semibold text-white">Create account</button>
      </form>
      <p className="text-sm">Already have an account? <Link to="/login" className="text-accent">Sign in</Link></p>
    </div>
  );
}

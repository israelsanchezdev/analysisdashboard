import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, TrendingUp } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuthStore();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        await register(name, email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-3">
            <TrendingUp className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-xl font-semibold text-white">Competitor Tracker</h1>
          <p className="text-surface-500 text-sm mt-1">Keep tabs on the competition</p>
        </div>

        {/* Card */}
        <div className="bg-surface-800 border border-surface-600 rounded-xl p-8">
          <h2 className="text-white font-medium mb-6">
            {mode === 'login' ? 'Sign in to your workspace' : 'Create your workspace'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm text-surface-500 mb-1.5">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3.5 py-2.5 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-surface-500 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3.5 py-2.5 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-surface-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-surface-700 border border-surface-600 text-white rounded-lg px-3.5 py-2.5 pr-10 text-sm placeholder-surface-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-white transition"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-surface-900 font-medium rounded-lg py-2.5 text-sm transition"
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-500">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={switchMode} className="text-accent hover:text-accent-hover transition">
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-surface-500 mt-6">
          Demo: register any email/password to get started
        </p>
      </div>
    </div>
  );
}

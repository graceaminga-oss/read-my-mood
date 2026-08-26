import { useState } from 'react';
import { login, signup } from '../api/backend';

function AuthForm({ onLogin }) {
  const [mode, setMode] = useState('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    try {
      let result;

      if (mode === 'signup') {
        result = await signup(name, email, password);
      } else {
        result = await login(email, password);
      }

      onLogin(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
  }

  const inputClasses =
    'w-full border border-[#D9CFB0] bg-[#FFFDF5] px-3 py-3 text-[#1B2A22] outline-none focus:border-[#21402F]';

  return (
    <div className="min-h-screen bg-[#21402F] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#B8D9C4] mb-3">
            Library membership
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#F3ECDA]">
            Read My Mood
          </h1>

          <p className="text-[#C9D6C6] mt-3 font-sans italic">
            {mode === 'login'
              ? 'Sign in to continue your reading journey.'
              : 'Join the shelf and start tracking how books make you feel.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F3ECDA] border border-[#D9CFB0] p-8 relative"
        >
          {/* punch-hole, library-card detail */}
          <span className="absolute top-5 right-5 w-3 h-3 rounded-full bg-[#21402F]" />

          <p className="font-mono text-[11px] uppercase tracking-widest text-[#7C7660] mb-1">
            Card no. {mode === 'login' ? '——' : 'new'}
          </p>

          <h2 className="font-serif text-2xl font-semibold text-[#1B2A22] mb-6">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>

          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className={inputClasses}
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className={inputClasses}
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#7C7660] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className={inputClasses}
            />
          </div>

          {error && (
            <div className="mb-5 border border-[#8C4A3A] bg-[#FBE9E3] px-4 py-3 text-sm text-[#8C4A3A] font-sans">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-[#1B2A22] bg-[#1B2A22] text-[#F3ECDA] py-3 font-mono uppercase tracking-wide hover:bg-[#F3ECDA] hover:text-[#1B2A22] disabled:opacity-50 transition-colors"
          >
            {loading
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-[#5B5646] underline decoration-[#D9CFB0] hover:text-[#1B2A22] font-sans"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthForm;

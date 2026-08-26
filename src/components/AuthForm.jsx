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

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500 mb-3">
            Welcome to
          </p>

          <h1 className="text-4xl font-bold text-stone-800">
            Read My Mood
          </h1>

          <p className="text-stone-500 mt-3">
            {mode === 'login'
              ? 'Sign in to continue your reading journey.'
              : 'Create an account and start building your reading shelf.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-stone-800 mb-6">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>

          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:ring-2 focus:ring-stone-400"
            />
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-stone-800 text-white py-3 font-semibold hover:bg-stone-700 disabled:opacity-50 transition"
          >
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-stone-600 underline hover:text-stone-900"
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
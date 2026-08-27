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
    <div className="min-h-screen bg-[#21402F] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.25em] text-[#B8D9C4] mb-3">
            Welcome to
          </p>

          <h1 className="font-['Fraunces'] text-4xl sm:text-5xl font-semibold text-[#F3ECDA] leading-tight">
            Read My Mood
          </h1>

          <p className="font-['Public_Sans'] text-sm sm:text-base text-[#C9D6C6] mt-3 leading-6 px-2">
            {mode === 'login'
              ? 'Sign in to continue your reading journey.'
              : 'Create an account and start building your reading shelf.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#F3ECDA] border border-[#D9CFB0] px-5 py-7 sm:p-8"
        >
          <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] mb-6">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>

          {mode === 'signup' && (
            <div className="mb-5">
              <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] outline-none focus:border-[#21402F]"
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] outline-none focus:border-[#21402F]"
            />
          </div>

          <div className="mb-5">
            <label className="block font-['Public_Sans'] text-sm font-semibold text-[#1B2A22] mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full border border-[#B0A67F] bg-[#FFFDF5] px-4 py-3 text-sm text-[#1B2A22] placeholder:text-[#8B856F] outline-none focus:border-[#21402F]"
            />
          </div>

          {error && (
            <div className="mb-5 border border-[#8C4A3A] bg-[#3A2420] px-4 py-3">
              <p className="font-['Public_Sans'] text-sm text-[#F0C9BC] leading-5"></p>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#21402F] text-[#F3ECDA] py-3.5 px-4 font-['Courier_Prime'] text-xs sm:text-sm uppercase tracking-wide hover:bg-[#162E21] disabled:opacity-50 transition-colors duration-200"
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
              className="font-['Public_Sans'] text-sm text-[#5B5646] underline underline-offset-4 hover:text-[#21402F]"
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
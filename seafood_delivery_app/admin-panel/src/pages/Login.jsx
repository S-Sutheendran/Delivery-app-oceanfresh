import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fish, Eye, EyeOff, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const usernameRef = useRef(null)

  useEffect(() => { usernameRef.current?.focus() }, [])

  const doLogin = (u, p) => {
    if (u === 'admin' && p === 'admin123') {
      login(u)
      navigate('/insights')
    } else {
      setError('Invalid credentials. Use admin / admin123')
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => doLogin(username.trim(), password), 600)
  }

  // Auto-fill and sign in immediately on clicking Login with empty fields
  const handleAutoLogin = () => {
    setError('')
    setLoading(true)
    let u = username.trim() || 'admin'
    let p = password || 'admin123'
    setUsername(u)
    setPassword(p)
    setTimeout(() => doLogin(u, p), 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-700 via-brand-600 to-teal-500 p-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-700 to-brand-600 px-8 py-7 text-center">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Fish size={28} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">OceanFresh Admin</h1>
            <p className="text-brand-100 text-sm mt-1">Sign in to your dashboard</p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            {/* Demo hint */}
            <div className="mb-5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
              <Zap size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Click <strong>Login</strong> to auto-fill credentials and sign in instantly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Username</label>
                <input
                  ref={usernameRef}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="input"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pr-10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="button"
                onClick={handleAutoLogin}
                disabled={loading}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : <Zap size={16} />}
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-5">
              Default: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">admin</code> / <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

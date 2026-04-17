import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UseLogin from '../hooks/UseLogin'
import { LogIn, ArrowLeft } from 'lucide-react'

const Login = () => {
  const [username, setusername] = useState('');
  const [password, setpassword] = useState('')
  const { loading, login } = UseLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4'>
      {/* Animated background */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-blob'></div>
        <div className='absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-blob animation-delay-2000'></div>
      </div>

      <div className='relative z-10 w-full max-w-md'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 text-slate-400 hover:text-slate-200 transition mb-8'
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Main Card */}
        <div className='backdrop-blur-xl bg-slate-800/50 border border-slate-700/50 rounded-2xl shadow-2xl p-8'>
          <div className='text-center mb-8'>
            <h1 className='gradient-text text-4xl font-bold mb-2'>Welcome Back</h1>
            <p className='text-slate-400'>Sign in to your CleanCode account</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            {/* Username Input */}
            <div>
              <label className='block text-sm font-medium text-slate-200 mb-2'>
                Username
              </label>
              <input
                type='text'
                placeholder='Enter your username'
                className='w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                value={username}
                onChange={(e) => setusername(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-medium text-slate-200 mb-2'>
                Password
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                className='w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between text-sm'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input type='checkbox' className='w-4 h-4 rounded' />
                <span className='text-slate-400 hover:text-slate-300'>Remember me</span>
              </label>
              <Link to='#' className='text-blue-400 hover:text-blue-300 transition'>
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <LogIn size={20} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* SignUp Link */}
          <div className='mt-6 text-center'>
            <p className='text-slate-400'>
              Don't have an account?{' '}
              <Link to='/signup' className='text-blue-400 hover:text-blue-300 font-semibold transition'>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className='text-center text-slate-500 text-sm mt-8'>
          By signing in, you agree to our Terms of Service
        </p>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  )
}

export default Login

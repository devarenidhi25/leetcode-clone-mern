import React, { useState } from 'react'
import GenderCheck from '../components/GenderCheck'
import { Link, useNavigate } from 'react-router-dom'
import UseSignUp from '../hooks/UseSignUp';
import { UserPlus, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
  });
  const { loading, signup } = UseSignUp();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs)
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-8'>
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
            <h1 className='gradient-text text-4xl font-bold mb-2'>Join CleanCode</h1>
            <p className='text-slate-400'>Create your account and start coding today</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Username Input */}
            <div>
              <label className='block text-sm font-medium text-slate-200 mb-2'>
                Username
              </label>
              <input
                type='text'
                placeholder='Choose your username'
                className='w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                required
              />
            </div>

            {/* Email Input */}
            <div>
              <label className='block text-sm font-medium text-slate-200 mb-2'>
                Email
              </label>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                value={inputs.email}
                onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
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
                placeholder='Create a strong password'
                className='w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition'
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                required
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label className='block text-sm font-medium text-slate-200 mb-3'>
                Gender
              </label>
              <GenderCheck onCheckboxChange={handleCheckboxChange} selectedGender={inputs.gender} />
            </div>

            {/* Terms & Conditions */}
            <div className='flex items-center gap-2 text-sm'>
              <input type='checkbox' className='w-4 h-4 rounded' required />
              <span className='text-slate-400'>
                I agree to the{' '}
                <Link to='#' className='text-blue-400 hover:text-blue-300'>
                  Terms of Service
                </Link>
              </span>
            </div>

            {/* SignUp Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full flex items-center justify-center gap-2 mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <UserPlus size={20} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className='mt-6 text-center'>
            <p className='text-slate-400'>
              Already have an account?{' '}
              <Link to='/login' className='text-blue-400 hover:text-blue-300 font-semibold transition'>
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className='text-center text-slate-500 text-sm mt-8'>
          Join thousands of developers on CleanCode
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

export default Signup

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, Boxes, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    }
  });

  const enteredPassword = watch('password');

  const onSubmit = (data) => {
    const res = registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    });

    if (res.success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0c10]/95 via-[#12161f]/85 to-[#1c1815]/90 backdrop-blur-[3px]" />
      
      <div className="relative z-10 w-full max-w-[460px] bg-[#141822]/85 backdrop-blur-xl rounded-[32px] p-7 sm:p-9 border border-amber-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.12)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-3 ring-4 ring-amber-500/10">
            <Boxes className="h-6 w-6 font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create an Account
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Join DropPoint • Logistics Authority Network
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
              <input
                type="text"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must have at least 2 characters'
                  }
                })}
                placeholder="Marcus Miller"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
                placeholder="marcus@example.com"
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Account Type / Role
            </label>
            <select
              {...register('role')}
              className="w-full text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl px-3 py-2 font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="user">Customer / Sender</option>
              <option value="agent">Delivery Associate / Agent</option>
              <option value="admin">Operations Admin</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 focus:outline-none p-1 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (val) => val === enteredPassword || 'Passwords do not match'
                })}
                placeholder="Re-enter password"
                className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 focus:outline-none p-1 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-1"
          >
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-400 hover:text-amber-300">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

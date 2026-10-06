import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Boxes, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Return to intended page or default to /dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data) => {
    const result = loginUser(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleDemoCredentials = () => {
    setValue('email', 'admin@cpts.io');
    setValue('password', 'Password123!');
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans antialiased overflow-hidden selection:bg-amber-500 selection:text-slate-900">
      
      {/* Background with Theme 4 Logistics Warehouse Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0c10]/95 via-[#12161f]/85 to-[#1c1815]/90 backdrop-blur-[3px]" />
      
      {/* Subtle Ambient Amber Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-amber-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Centered Frosted Dark Glassy Card (#141822) */}
      <div className="relative z-10 w-full max-w-[440px] bg-[#141822]/85 backdrop-blur-xl rounded-[32px] p-7 sm:p-9 border border-amber-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.12)]">
        
        {/* Branding & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-3 ring-4 ring-amber-500/10">
            <Boxes className="h-6 w-6 font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Drop<span className="text-amber-400">Point</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Welcome to DropPoint • Logistics Authority
          </p>
        </div>

        {/* Quick Demo Pre-fill Banner */}
        <div className="mb-5 p-2.5 px-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-amber-300">Demo User: </span>
            <span className="text-slate-300 font-mono text-[11px]">admin@cpts.io</span>
          </div>
          <button
            type="button"
            onClick={handleDemoCredentials}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer text-[11px] shadow-sm shadow-amber-500/20"
          >
            <Sparkles className="h-3 w-3" />
            <span>Fill</span>
          </button>
        </div>

        {/* Credential Fields Form with Card-matching Background (#141822 / semi-translucent) */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Email Field with Background Matching Card */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
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
                placeholder="admin@cpts.io"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all font-medium text-white placeholder-slate-500 shadow-inner"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field with Background Matching Card */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required'
                })}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all font-medium text-white placeholder-slate-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 focus:outline-none p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-rose-400 font-medium">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Preference Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-amber-500/30 bg-[#141822] text-amber-500 focus:ring-amber-400 cursor-pointer accent-amber-500"
            />
            <label
              htmlFor="remember"
              className="text-xs sm:text-sm text-slate-300 cursor-pointer select-none font-medium"
            >
              Remember my preference
            </label>
          </div>

          {/* Primary Amber Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.99] text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Registration Hook */}
        <div className="mt-6 text-center border-t border-slate-800/80 pt-5">
          <p className="text-xs sm:text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-amber-400 hover:text-amber-300 transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, Boxes, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const enteredPassword = watch('newPassword');

  const handleEmailSubmit = (data) => {
    setResetEmail(data.email);
    setStep(2);
  };

  const handlePasswordSubmit = (data) => {
    const result = resetPassword(resetEmail, data.newPassword);
    if (result.success) {
      setStep(3);
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

      <div className="relative z-10 w-full max-w-[440px] bg-[#141822]/85 backdrop-blur-xl rounded-[32px] p-7 sm:p-9 border border-amber-500/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(245,158,11,0.12)]">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 mb-3 ring-4 ring-amber-500/10">
            <Boxes className="h-6 w-6 font-bold" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Password Recovery
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Reset credentials for DropPoint Logistics
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit(handleEmailSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="admin@cpts.io"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(handlePasswordSubmit)} className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-300 mb-2">
              Resetting credentials for: <strong className="text-white">{resetEmail}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400/80" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmNewPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === enteredPassword || 'Passwords do not match'
                  })}
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#141822] border border-amber-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 font-medium text-white placeholder-slate-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="mt-1 text-xs text-rose-400 font-medium">{errors.confirmNewPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <span>Save New Password</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center py-4 space-y-4">
            <div className="h-16 w-16 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h3 className="text-lg font-bold text-white">Password Updated!</h3>
            <p className="text-xs text-slate-400">
              Your new credentials have been updated in Local Storage.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        )}

        <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

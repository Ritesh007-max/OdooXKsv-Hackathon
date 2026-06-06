import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Mail, Lock, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';

export default function LoginPage({ onNavigateToSignup }) {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email.trim() || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex items-center justify-center p-4 font-sans select-none text-gray-900">
      {/* Light card container matching .dd-card-elevated style */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded shadow-lg p-8 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded bg-[#F59E0B] flex items-center justify-center shadow-sm mb-4">
            <span className="font-mono font-bold text-2xl text-[#111111]">VB</span>
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-tight text-gray-900">VendorBridge</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your procurement portal</p>
        </div>

        {/* Errors display - matching status chip styling */}
        {(validationError || error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded p-3.5 flex items-start gap-3">
            <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm leading-relaxed">{validationError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input group */}
          <div className="space-y-1.5">
            <label className="dd-label !mb-0 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Mail size={18} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
              />
            </div>
          </div>

          {/* Password input group */}
          <div className="space-y-1.5">
            <label className="dd-label !mb-0 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button - matching .dd-btn-primary */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#111111] font-bold text-sm rounded shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-gray-500 text-xs">
            Don't have an account?{' '}
            <button
              onClick={onNavigateToSignup}
              className="text-[#F59E0B] hover:text-[#D97706] font-bold cursor-pointer underline underline-offset-4 bg-transparent border-none focus:outline-none transition-colors"
            >
              Sign up today
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

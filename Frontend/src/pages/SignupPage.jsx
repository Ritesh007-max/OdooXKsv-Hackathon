import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ShieldAlert, ArrowRight, Shield, Award, Users } from 'lucide-react';

export default function SignupPage({ onNavigateToLogin }) {
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('vendor'); // 'vendor' | 'officer' | 'manager'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!name.trim() || !email.trim() || !password) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    try {
      setIsSubmitting(true);
      await register(name.trim(), email.trim(), password, role);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rolesConfig = [
    {
      id: 'vendor',
      title: 'Vendor',
      desc: 'Submit quotes, manage POs & process invoices.',
      icon: Users,
      color: 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-500',
      activeColor: 'border-[#F59E0B] bg-[#F59E0B]/5 text-[#D97706] ring-1 ring-[#F59E0B]/30',
    },
    {
      id: 'officer',
      title: 'Procurement Officer',
      desc: 'Create RFQs, issue orders & evaluate bids.',
      icon: Shield,
      color: 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-500',
      activeColor: 'border-[#F59E0B] bg-[#F59E0B]/5 text-[#D97706] ring-1 ring-[#F59E0B]/30',
    },
    {
      id: 'manager',
      title: 'Manager / Approver',
      desc: 'Approve requisitions, audit reports & view analytics.',
      icon: Award,
      color: 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-500',
      activeColor: 'border-[#F59E0B] bg-[#F59E0B]/5 text-[#D97706] ring-1 ring-[#F59E0B]/30',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex items-center justify-center p-4 overflow-y-auto font-sans select-none text-gray-900">
      {/* Light card container */}
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded shadow-lg p-8 my-8 relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-bold font-mono tracking-tight text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Get started with VendorBridge procurement</p>
        </div>

        {/* Errors display - matching status chip styling */}
        {(validationError || error) && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded p-3.5 flex items-start gap-3">
            <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
            <p className="text-red-700 text-sm leading-relaxed">{validationError || error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name input */}
          <div className="space-y-1.5">
            <label className="dd-label !mb-0 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                <UserIcon size={18} />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:border-[#F59E0B] focus:ring-2 focus:ring-[#F59E0B]/20 transition-all"
              />
            </div>
          </div>

          {/* Email input */}
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

          {/* Password input */}
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
                placeholder="Min. 6 characters"
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

          {/* Role selector cards */}
          <div className="space-y-2">
            <label className="dd-label !mb-0 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Choose Portal Role
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {rolesConfig.map((item) => {
                const IconComponent = item.icon;
                const isActive = role === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`p-3.5 text-left border rounded transition-all duration-200 cursor-pointer flex flex-col items-start gap-1.5 focus:outline-none ${
                      isActive ? item.activeColor : item.color
                    }`}
                  >
                    <IconComponent size={20} className="mb-0.5" />
                    <span className="text-gray-900 text-sm font-semibold leading-none">{item.title}</span>
                    <span className="text-gray-500 text-[11px] leading-tight mt-0.5">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-[#F59E0B] hover:bg-[#D97706] text-[#111111] font-bold text-sm rounded shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Create Account <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-100 pt-5">
          <p className="text-gray-500 text-xs">
            Already have an account?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-[#F59E0B] hover:text-[#D97706] font-bold cursor-pointer underline underline-offset-4 bg-transparent border-none focus:outline-none transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client'; 
import { useRouter } from 'next/navigation';
import { Mail, Phone, KeyRound, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'contact' | 'otp'>('contact');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (authMethod === 'email') {
      const { error } = await supabase.auth.signInWithOtp({
        email: contact,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/profile`,
        },
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email and click the sign-in link to continue.');
      }
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        phone: contact,
      });

      if (error) {
        setError(error.message);
      } else {
        setStep('otp');
        setMessage('A secure code has been sent to your phone.');
      }
    }

    setLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.verifyOtp({
      phone: contact,
      token: otp,
      type: 'sms',
    });

    if (error) {
      setError('Invalid or expired code. Please try again.');
      setLoading(false);
    } else {
      router.push('/profile');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4 font-body bg-[var(--color-brand-cream)]">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-[#e2d5c5] relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-heading font-bold text-3xl text-[#8b4a62] tracking-wider block mb-2">
            COMFY STUDIO
          </Link>
          <p className="text-gray-500 text-sm">Log in or sign up to continue</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 text-center">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md border border-green-100 text-center">{message}</div>}

        {step === 'contact' && (
          <>
            {/* Email / Phone Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setContact(''); setError(null); setMessage(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'email' ? 'bg-white text-[#8b4a62] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); setContact(''); setError(null); setMessage(null); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${authMethod === 'phone' ? 'bg-white text-[#8b4a62] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {authMethod === 'email' ? <Mail size={18} /> : <Phone size={18} />}
                  </div>
                  <input
                    type={authMethod === 'email' ? 'email' : 'tel'}
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#8b4a62] text-sm text-gray-900 bg-[#FAF8F5]"
                    placeholder={authMethod === 'email' ? "you@example.com" : "+91 98765 43210"}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md shadow-sm text-sm font-semibold text-white bg-[#8b4a62] hover:bg-[#633043] transition disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : 'Continue'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              Continue with Google
            </button>
          </>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <button 
              type="button" 
              onClick={() => { setStep('contact'); setOtp(''); setError(null); }}
              className="flex items-center text-sm text-gray-500 hover:text-[#8b4a62] transition mb-4"
            >
              <ChevronLeft size={16} className="mr-1" /> Back
            </button>
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Enter 6-Digit Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <KeyRound size={18} />
                </div>
                <input
                  id="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#8b4a62] text-lg text-center tracking-[0.5em] font-semibold text-gray-900 bg-[#FAF8F5]"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-md shadow-sm text-sm font-semibold text-white bg-[#8b4a62] hover:bg-[#633043] transition disabled:opacity-70"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Verify Code'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
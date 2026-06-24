'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, MapPin, Mail, Phone, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUserId(user.id);
      setUserEmail(user.email || '');
      setUserPhone(user.phone || '');

      // Load saved profile data (address / phone) if it exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('address, phone')
        .eq('id', user.id)
        .single();

      if (profile) {
        setAddress(profile.address || '');
        if (profile.phone) setUserPhone(profile.phone);
      }

      setLoading(false);
    }
    getUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        phone: userPhone,
        address: address,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);

    if (error) {
      setMessage('Something went wrong. Please try again.');
    } else {
      setMessage('Profile details and address successfully saved!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)]">
        <Loader2 className="animate-spin text-[#8b4a62]" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] py-12 px-4 font-body">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e2d5c5] overflow-hidden">
          
          {/* Header */}
          <div className="bg-[#8b4a62] p-8 text-white flex justify-between items-center">
            <div>
              <h1 className="font-heading text-3xl mb-1 tracking-wide">My Account</h1>
              <p className="text-white/80 text-sm">Manage your personal details and shipping address</p>
            </div>
            
            <div 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-semibold"
            >
              <LogOut size={16} /> Sign Out
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {message && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium animate-in fade-in">
                {message}
              </div>
            )}
            
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={16} className="text-[#8b4a62]" /> Email ID
                  </label>
                  <input 
                    type="email" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4a62] bg-gray-50 text-gray-800"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={16} className="text-[#8b4a62]" /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#8b4a62] bg-gray-50 text-gray-800"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="text-[#8b4a62]" /> Shipping Address
                </label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#8b4a62] resize-none text-gray-800 bg-gray-50"
                  placeholder="House/Flat No., Building Name&#10;Street Address&#10;City, State, Pincode"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <div 
                  onClick={handleSaveProfile} 
                  className={`flex items-center gap-2 bg-[#8b4a62] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#7a3e52] transition-colors ${saving ? 'opacity-70 pointer-events-none' : ''}`}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Profile Details'}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
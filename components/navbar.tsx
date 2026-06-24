'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, ChevronDown } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        fetchCartCount(user.id);
      } else {
        setCartCount(0);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        fetchCartCount(session.user.id);
      } else {
        setCartCount(0);
      }
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const fetchCartCount = async (userId: string) => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', userId);

    if (!error && data) {
      const total = data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 w-full z-40 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="font-heading font-bold text-2xl md:text-3xl text-[#8b4a62] tracking-wider">
          COMFY STUDIO
        </Link>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input type="text" placeholder="Search products..." className="w-full bg-[#f8f6f3] border border-gray-200 rounded-l-md px-4 py-2 focus:outline-none text-sm text-gray-700" />
          <div className="bg-[#8b4a62] text-white px-5 py-2 rounded-r-md cursor-pointer hover:bg-[#7a3e52] transition-colors flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Link href={isLoggedIn ? "/profile" : "/login"} aria-label="Profile">
            <User size={24} className="text-gray-700 hover:text-[#8b4a62] transition-colors" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative">
            <ShoppingCart size={24} className="text-gray-700 hover:text-[#8b4a62] transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#8b4a62] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav className="bg-[#8b4a62] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center">
          <div className="relative" onMouseEnter={() => setShowCategories(true)} onMouseLeave={() => setShowCategories(false)}>
            <div className="flex items-center gap-2 py-3 pr-6 cursor-pointer hover:text-[#c8a97e] transition-colors font-semibold tracking-wide">
              <Menu size={18} />
              All Categories
              <ChevronDown size={14} className={`transition-transform duration-200 ${showCategories ? 'rotate-180' : ''}`} />
            </div>

            {showCategories && (
              <div className="absolute top-full left-0 w-64 bg-white border border-gray-200 shadow-xl rounded-b-md z-50 text-gray-800 overflow-hidden">
                <Link href="/category/crochet-scrunchy" className="block px-5 py-3 hover:bg-[#FAF8F5] hover:text-[#8b4a62] border-b border-gray-100 font-medium transition-colors">Crochet Scrunchy</Link>
                <Link href="/category/crochet-keychain" className="block px-5 py-3 hover:bg-[#FAF8F5] hover:text-[#8b4a62] border-b border-gray-100 font-medium transition-colors">Crochet Keychain</Link>
                <Link href="/category/crochet-teddy-bear" className="block px-5 py-3 hover:bg-[#FAF8F5] hover:text-[#8b4a62] border-b border-gray-100 font-medium transition-colors">Crochet Teddy Bear</Link>
                <Link href="/category/crochet-coaster" className="block px-5 py-3 hover:bg-[#FAF8F5] hover:text-[#8b4a62] font-medium transition-colors">Crochet Coaster</Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 ml-4 font-medium tracking-wide">
            <Link href="/category/sale" className="py-3 hover:text-[#c8a97e] transition-colors">Today's Deals</Link>
            <Link href="/category/sale" className="py-3 hover:text-[#c8a97e] transition-colors">Sale</Link>
            <Link href="/" className="py-3 hover:text-[#c8a97e] transition-colors">Home</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
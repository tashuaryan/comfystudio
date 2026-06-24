'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      const { data: featured } = await supabase
        .from('products')
        .select('*')
        .limit(8);

      const { data: latest } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);

      if (featured) setFeaturedProducts(featured);
      if (latest) setNewArrivals(latest);
    }
    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen pb-20 pt-12 px-4 md:px-8 bg-[var(--color-brand-cream)] font-body">

      {/* ========================= */}
      {/* 1. NEW ARRIVALS — TOP     */}
      {/* ========================= */}
      {newArrivals.length > 0 && (
        <section
          className="max-w-7xl mx-auto"
          style={{ marginBottom: '10px', paddingBottom: '5px' }}
        >
          <h2 className="font-script text-5xl md:text-6xl text-[#c8a97e] mb-2 text-center drop-shadow-sm">
            New Arrivals
          </h2>
          <p className="text-center text-gray-500 mb-10 font-light">
            Just added to the store
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {newArrivals.map((product) => (
              <Link
                key={product.id}
                href="/shop"
                className="bg-white border-2 border-[#8b4a62] rounded-xl pop-out-effect flex flex-col overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ width: '260px', minHeight: '320px' }}
              >
                <div className="w-full h-52 overflow-hidden relative bg-gray-100 flex-shrink-0">
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                      Sold Out
                    </div>
                  )}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow bg-white">
                  <span className="text-xs text-[#8b4a62] font-semibold uppercase tracking-widest mb-2">
                    ✨ New
                  </span>
                  <h3 className="font-heading text-base text-gray-800 mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-[#8b4a62] font-bold text-xl mt-auto">
                    ₹{product.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Spacer + Gold Divider + Spacer */}
      <div style={{ height: '40px' }}></div>
      <div className="max-w-7xl mx-auto border-t-2 border-[#c8a97e]/40"></div>
      <div style={{ height: '40px' }}></div>

      {/* ========================= */}
      {/* 2. CATEGORY GRID          */}
      {/* ========================= */}
      <section
        className="max-w-7xl mx-auto"
        style={{ marginBottom: '10px', paddingBottom: '5px' }}
      >
        {/* Left: Big Frame + Right: Four Smaller Frames */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Big Frame — Crochet Scrunchy */}
          <Link
            href="/shop?category=Crochet+Scrunchy"
            className="group block h-[600px] bg-[#8b4a62] border-2 border-[#c8a97e] rounded-xl pop-out-effect relative overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#3d1a24]/80 to-transparent z-10"></div>
            <div className="absolute bottom-10 left-10 z-20">
              <h3 className="font-script text-5xl text-[#c8a97e] mb-2 group-hover:scale-105 transition-transform origin-left">
                Handcrafted
              </h3>
              <h4 className="font-heading text-4xl tracking-wide text-[#fdfaf6]">
                Crochet Scrunchy
              </h4>
              <p className="mt-3 text-sm text-[#fdfaf6] opacity-80 max-w-xs font-light">
                Soft, beautiful, and made with care. Perfect for everyday wear.
              </p>
            </div>
          </Link>

          {/* Right: Four Smaller Frames */}
          <div className="h-[600px] grid grid-cols-2 grid-rows-2 gap-6">
            <Link
              href="/shop?category=Crochet+Keychain"
              className="bg-[#8b4a62] border-2 border-[#c8a97e] rounded-xl pop-out-effect flex flex-col items-center justify-center p-6 text-[#fdfaf6] shadow-md group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              <h3 className="font-script text-4xl group-hover:text-[#c8a97e] transition-colors z-10">
                Keychains
              </h3>
            </Link>

            <Link
              href="/shop?category=Crochet+Teddy+Bear"
              className="bg-[#8b4a62] border-2 border-[#c8a97e] rounded-xl pop-out-effect flex flex-col items-center justify-center p-6 text-[#fdfaf6] shadow-md group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              <h3 className="font-script text-4xl group-hover:text-[#c8a97e] transition-colors z-10">
                Teddy Bears
              </h3>
            </Link>

            <Link
              href="/shop?category=Crochet+Coaster"
              className="bg-[#8b4a62] border-2 border-[#c8a97e] rounded-xl pop-out-effect flex flex-col items-center justify-center p-6 text-[#fdfaf6] shadow-md group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              <h3 className="font-script text-4xl group-hover:text-[#c8a97e] transition-colors z-10">
                Coasters
              </h3>
            </Link>

            <Link
              href="/shop?category=Sale"
              className="bg-[#633043] border-2 border-[#c8a97e] rounded-xl pop-out-effect flex flex-col items-center justify-center p-6 text-[#fdfaf6] shadow-md group relative overflow-hidden"
            >
              <h3 className="font-heading text-4xl tracking-widest group-hover:text-[#c8a97e] transition-colors z-10">
                SALE
              </h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Spacer + Gold Divider + Spacer */}
      <div style={{ height: '40px' }}></div>
      <div className="max-w-7xl mx-auto border-t-2 border-[#c8a97e]/40"></div>
      <div style={{ height: '40px' }}></div>

      {/* ========================= */}
      {/* 3. FEATURED ITEMS         */}
      {/* ========================= */}
      {featuredProducts.length > 0 && (
        <section
          className="max-w-7xl mx-auto"
          style={{ marginBottom: '10px', paddingBottom: '5px' }}
        >
          <h2 className="font-script text-5xl md:text-6xl text-[#c8a97e] mb-2 text-center drop-shadow-sm">
            Featured Items
          </h2>
          <p className="text-center text-gray-500 mb-10 font-light">
            Our most loved pieces
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href="/shop"
                className="bg-[#8b4a62] border-2 border-[#c8a97e] rounded-xl pop-out-effect flex flex-col overflow-hidden shadow-md group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ width: '260px', minHeight: '380px' }}
              >
                <div className="w-full h-52 overflow-hidden relative bg-[#633043] flex-shrink-0">
                  {product.stock === 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold z-10">
                      Sold Out
                    </div>
                  )}
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs text-[#c8a97e] uppercase tracking-widest mb-2">
                    {product.category}
                  </span>
                  <h3 className="font-heading text-base text-[#fdfaf6] mb-2 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-300 font-light line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-auto border-t border-[#c8a97e]/30 pt-4">
                    <span className="font-bold text-xl text-[#c8a97e]">
                      ₹{product.price}
                    </span>
                    <span className="bg-[#c8a97e] text-[#633043] px-4 py-2 rounded-sm font-semibold text-xs tracking-widest hover:bg-white transition duration-300 uppercase">
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Spacer + Gold Divider + Spacer */}
      <div style={{ height: '40px' }}></div>
      <div className="max-w-7xl mx-auto border-t-2 border-[#c8a97e]/40"></div>
      <div style={{ height: '40px' }}></div>

      {/* ========================= */}
      {/* 4. NEWSLETTER             */}
      {/* ========================= */}
      <section
        className="max-w-2xl mx-auto text-center px-4"
        style={{ marginBottom: '80px', paddingTop: '40px' }}
      >
        <h2 className="font-script text-6xl text-[#c8a97e] mb-4">
          Stay in the Loop
        </h2>
        <p className="text-[#2d3748] mb-8 font-light">
          Subscribe for exclusive collection drops and new crochet arrivals.
        </p>
        <form
          className="flex items-center max-w-md mx-auto relative"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 bg-transparent border-b border-[#8b4a62] py-3 pl-2 pr-10 focus:outline-none focus:border-[#c8a97e] transition-colors text-gray-800 placeholder-gray-500"
            required
          />
          <button
            type="submit"
            className="absolute right-0 text-[#8b4a62] hover:text-[#c8a97e] transition-colors p-2"
            aria-label="Subscribe"
          >
            <Send size={20} />
          </button>
        </form>
      </section>

    </main>
  );
}
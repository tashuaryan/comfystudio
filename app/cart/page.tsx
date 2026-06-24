'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';

type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  products: {
    id: string;
    title: string;
    price: number;
    image_url: string;
  } | null;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadCart() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, product_id, products(id, title, price, image_url)')
        .eq('user_id', user.id);

      if (!error && data) {
        setItems(data as unknown as CartItem[]);
      }
      setLoading(false);
    }
    loadCart();
  }, [supabase, router]);

  const updateQuantity = async (cartItemId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdating(cartItemId);

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', cartItemId);

    if (!error) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        )
      );
    }
    setUpdating(null);
  };

  const removeItem = async (cartItemId: string) => {
    setUpdating(cartItemId);
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (!error) {
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    }
    setUpdating(null);
  };

  const total = items.reduce(
    (sum, item) => sum + (item.products?.price ?? 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)]">
        <Loader2 className="animate-spin text-[#8b4a62]" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] py-12 px-4 font-body">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl text-[#8b4a62] mb-8 tracking-wide">
          Your Cart
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2d5c5] p-12 text-center">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">Your cart is empty.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2d5c5] overflow-hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-6 border-b border-gray-100 last:border-b-0"
              >
                <img
                  src={item.products?.image_url}
                  alt={item.products?.title}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-50"
                />

                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {item.products?.title}
                  </p>
                  <p className="text-[#8b4a62] font-medium mt-1">
                    ₹{item.products?.price}
                  </p>
                </div>

                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={updating === item.id}
                    aria-label="Decrease quantity"
                    className="text-gray-500 hover:text-[#8b4a62] disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={updating === item.id}
                    aria-label="Increase quantity"
                    className="text-gray-500 hover:text-[#8b4a62] disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="w-20 text-right font-semibold text-gray-800">
                  ₹{(item.products?.price ?? 0) * item.quantity}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  disabled={updating === item.id}
                  aria-label="Remove item from cart"
                  className="text-gray-400 hover:text-red-500 disabled:opacity-40"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            <div className="p-6 bg-[#FAF8F5] flex justify-between items-center">
              <span className="font-heading text-xl text-gray-800">
                Total: ₹{total}
              </span>
              <div className="bg-[#8b4a62] text-white px-8 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#7a3e52] transition-colors">
                Proceed to Checkout
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
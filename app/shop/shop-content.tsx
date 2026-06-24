'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Loader2, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
};

export default function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') || 'all';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  const categories = ['all', 'Crochet Scrunchy', 'Crochet Keychain', 'Crochet Teddy Bear', 'Crochet Coaster', 'Sale'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from('products').select('*');
      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }
      const { data, error } = await query;
      if (error) console.error('Error fetching products:', error);
      else setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [selectedCategory]);

  const handleAddToCart = async (product: Product) => {
    setAddingToCart(true);
    setAddedToCart(false);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    const { data: existing } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert([{ user_id: user.id, product_id: product.id, quantity: 1 }]);
    }

    setAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] py-12 px-4 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl text-[#633043] tracking-wide mb-4">Our Handcrafted Collection</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse through our beautifully made crochet items.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all shadow-sm border ${selectedCategory === cat ? 'bg-[#633043] text-[#fdfaf6] border-[#633043]' : 'bg-white text-gray-700 border-[#e2d5c5] hover:bg-gray-50'}`}>
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-[#633043]" />
          </div>
        ) : activeProduct ? (
          <div className="bg-white rounded-2xl shadow-xl border border-[#e2d5c5] p-8 md:p-12 max-w-4xl mx-auto">
            <button onClick={() => { setActiveProduct(null); setAddedToCart(false); }} className="flex items-center gap-2 text-[#8b4a62] font-semibold mb-8 hover:underline">
              <ArrowLeft size={18} /> Back to Catalog
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <img src={activeProduct.image_url} alt={activeProduct.title} className="w-full h-[400px] object-cover rounded-xl shadow-md" />
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-heading text-[#633043] mb-2">{activeProduct.title}</h2>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">{activeProduct.category}</p>
                  <p className="text-4xl font-bold text-[#8b4a62] mb-6">₹{activeProduct.price}</p>
                  <p className="text-gray-600 leading-relaxed mb-6">{activeProduct.description}</p>
                  <p className="text-sm text-gray-500 mb-6">Stock: <span className={activeProduct.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{activeProduct.stock > 0 ? `${activeProduct.stock} available` : 'Out of Stock'}</span></p>
                </div>
                <button
                  onClick={() => handleAddToCart(activeProduct)}
                  disabled={activeProduct.stock <= 0 || addingToCart}
                  className="w-full bg-[#633043] text-white py-4 rounded-xl font-semibold hover:bg-[#4a2432] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-lg shadow-md"
                >
                  {addingToCart ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : addedToCart ? (
                    <Check size={22} />
                  ) : (
                    <ShoppingBag size={22} />
                  )}
                  {activeProduct.stock <= 0 ? 'Sold Out' : addedToCart ? 'Added to Cart!' : addingToCart ? 'Adding...' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} onClick={() => setActiveProduct(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#e2d5c5] flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="h-64 overflow-hidden relative">
                  <img src={product.image_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 bg-white/90 text-xs px-3 py-1 rounded-full font-medium text-gray-700">{product.category}</span>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate group-hover:text-[#633043]">{product.title}</h3>
                  <p className="text-[#8b4a62] font-bold text-xl mb-4">₹{product.price}</p>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm text-gray-500">
                    <span>Stock: {product.stock}</span>
                    <span className="text-[#633043] font-semibold group-hover:underline">View Details</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#e2d5c5] max-w-lg mx-auto shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
            <button onClick={() => setSelectedCategory('all')} className="text-[#633043] font-semibold underline">View All Items</button>
          </div>
        )}
      </div>
    </main>
  );
}
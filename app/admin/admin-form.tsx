'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { PackagePlus, Loader2, Plus, X } from 'lucide-react';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
};

export default function AdminForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('10');
  const [imageUrl, setImageUrl] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (data) {
      setCategories(data);
      if (data.length > 0 && !category) {
        setCategory(data[0].name);
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setAddingCategory(true);
    setCategoryError(null);

    const { error } = await supabase
      .from('categories')
      .insert([{ name: newCategoryName.trim() }]);

    if (error) {
      setCategoryError(error.message);
    } else {
      setNewCategoryName('');
      setShowAddCategory(false);
      await fetchCategories();
      setCategory(newCategoryName.trim());
    }
    setAddingCategory(false);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase
      .from('products')
      .insert([
        {
          title: title,
          description: description,
          price: parseInt(price),
          category: category,
          stock: parseInt(stock),
          image_url: imageUrl || 'https://via.placeholder.com/400',
        }
      ]);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTitle('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setStock('10');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] py-12 px-4 font-body">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-[#e2d5c5] overflow-hidden">

        <div className="bg-[#633043] p-6 text-[#fdfaf6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PackagePlus size={28} className="text-[#c8a97e]" />
            <h1 className="font-heading text-2xl tracking-wide">Add New Product</h1>
          </div>
          <Link href="/" className="text-sm hover:text-[#c8a97e] transition-colors">
            Back to Store
          </Link>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 text-sm font-medium">
              Product published successfully!
            </div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAddProduct} className="space-y-6">

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
              <input
                id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50"
                placeholder="e.g., Lavender Crochet Scrunchy"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="desc" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                id="desc" required value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50 resize-none"
                placeholder="Describe the materials, size, and feel..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                <input
                  id="price" type="number" required min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50"
                  placeholder="e.g., 299"
                />
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1">Items in Stock</label>
                <input
                  id="stock" type="number" required min="0" value={stock} onChange={(e) => setStock(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50"
                />
              </div>
            </div>

            {/* Category Dropdown + Add New */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
                <button
                  type="button"
                  onClick={() => setShowAddCategory(!showAddCategory)}
                  className="flex items-center gap-1 text-xs font-semibold text-[#8b4a62] hover:text-[#7a3e52]"
                >
                  {showAddCategory ? <X size={14} /> : <Plus size={14} />}
                  {showAddCategory ? 'Cancel' : 'Add New Category'}
                </button>
              </div>

              {showAddCategory && (
                <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="e.g., Crochet Bag"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-[#8b4a62] bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={addingCategory}
                      className="flex items-center gap-1 bg-[#8b4a62] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[#7a3e52] transition-colors disabled:opacity-50"
                    >
                      {addingCategory ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
                    </button>
                  </div>
                  {categoryError && (
                    <p className="text-xs text-red-600 mt-2">{categoryError}</p>
                  )}
                </div>
              )}

              <select
                id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-1">Image Link (URL)</label>
              <input
                id="image" type="url" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-[#8b4a62] bg-gray-50"
                placeholder="Paste the image link here..."
              />
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#8b4a62] text-white px-6 py-3 rounded-md font-semibold hover:bg-[#7a3e52] transition-colors"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <PackagePlus size={20} />}
              {loading ? 'Adding to Store...' : 'Publish Product'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
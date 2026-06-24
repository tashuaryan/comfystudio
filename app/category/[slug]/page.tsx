import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { PackageX } from 'lucide-react';

function slugToCategoryName(slug: string) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categoryName = slugToCategoryName(slug);

  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('id, title, price, image_url, category')
    .eq('category', categoryName);

  return (
    <main className="min-h-screen bg-[var(--color-brand-cream)] py-12 px-4 font-body">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-heading text-3xl text-[#8b4a62] mb-8 tracking-wide">
          {categoryName}
        </h1>

        {!products || products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#e2d5c5] p-12 text-center">
            <PackageX className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-600">No products found in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-xl border border-[#e2d5c5] overflow-hidden hover:shadow-md transition-shadow"
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-48 object-cover bg-gray-50"
                />
                <div className="p-4">
                  <p className="font-medium text-gray-800 truncate">{product.title}</p>
                  <p className="text-[#8b4a62] font-semibold mt-1">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

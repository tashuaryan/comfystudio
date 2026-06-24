import { Suspense } from 'react';
import ShopContent from './shop-content';
import { Loader2 } from 'lucide-react';

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-brand-cream)]">
          <Loader2 size={40} className="animate-spin text-[#633043]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
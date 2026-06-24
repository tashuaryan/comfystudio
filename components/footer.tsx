import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a202c] text-[#fdfaf6] font-body pt-16 pb-6 px-4 md:px-12 mt-20 border-t-4 border-[#8b4a62]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        
        {/* Logo & Brand Info */}
        <div className="lg:col-span-2 pr-8">
          <Link href="/" className="font-heading font-bold text-3xl text-[#c8a97e] tracking-wider">
            COMFY STUDIO
          </Link>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Your destination for aesthetic stationery, elegant tumblers, and premium bedding. A world of comfort and detail delivered straight to your door.
          </p>
        </div>

        {/* Links: About Us */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-white mb-4">About Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-[#c8a97e] transition">About Us</Link></li>
            <li><Link href="/careers" className="hover:text-[#c8a97e] transition">Careers</Link></li>
            <li><Link href="/press" className="hover:text-[#c8a97e] transition">Press</Link></li>
          </ul>
        </div>

        {/* Links: My Account */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-white mb-4">My Account</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/account" className="hover:text-[#c8a97e] transition">My Account</Link></li>
            <li><Link href="/orders" className="hover:text-[#c8a97e] transition">Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-[#c8a97e] transition">Wishlist</Link></li>
            <li><Link href="/settings" className="hover:text-[#c8a97e] transition">Settings</Link></li>
          </ul>
        </div>

        {/* Links: Help Center & Socials */}
        <div>
          <h3 className="font-heading font-semibold text-lg text-white mb-4">Help Center</h3>
          <ul className="space-y-3 text-sm text-gray-400 mb-6">
            <li><Link href="/help" className="hover:text-[#c8a97e] transition">Returns</Link></li>
            <li><Link href="/track" className="hover:text-[#c8a97e] transition">Track Package</Link></li>
            <li><Link href="/contact" className="hover:text-[#c8a97e] transition">Contact Us</Link></li>
          </ul>
          
          {/* Social Icons (Replaced with native SVGs) */}
          <div className="flex gap-4">
            {/* Facebook */}
            <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-[#8b4a62] transition text-white" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            {/* YouTube */}
            <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-[#8b4a62] transition text-white" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
            </a>
            {/* Instagram */}
            <a href="#" className="bg-gray-800 p-2.5 rounded-full hover:bg-[#8b4a62] transition text-white" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="max-w-7xl mx-auto border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-3">
          <span>🔒 Secure Payments:</span>
          <span className="bg-white text-gray-800 px-2.5 py-1 rounded-sm text-xs font-bold">Visa</span>
          <span className="bg-white text-gray-800 px-2.5 py-1 rounded-sm text-xs font-bold">MC</span>
          <span className="bg-white text-gray-800 px-2.5 py-1 rounded-sm text-xs font-bold">PayPal</span>
          <span className="bg-white text-gray-800 px-2.5 py-1 rounded-sm text-xs font-bold">UPI</span>
        </div>
        <div>
          © 2026 Comfy Studio.
        </div>
      </div>
    </footer>
  );
}
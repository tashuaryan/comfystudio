import './globals.css';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import Chatbot from '@/components/chatbot';

export const metadata = {
  title: 'Comfy Studio',
  description: 'Your destination for aesthetic stationery, elegant tumblers, and premium bedding.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative">
        <Navbar />
        
        {/* The main content of your pages will render here */}
        <div className="min-h-screen">
          {children}
        </div>
        
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}
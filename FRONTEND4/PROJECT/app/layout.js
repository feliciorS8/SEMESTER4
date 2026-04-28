import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "RS Yasmin - Reservasi Online",
  description: "Layanan Reservasi Rumah Sakit Yasmin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-cyan-800 text-white py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>&copy; {new Date().getFullYear()} Rumah Sakit Yasmin. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

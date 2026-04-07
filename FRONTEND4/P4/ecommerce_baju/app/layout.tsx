import "./globals.css";

export const metadata = {
  title: "STIKOM Store – Ecommerce Baju",
  description: "Toko baju online STIKOM",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Navbar */}
        <nav className="navbar-custom">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <a href="/" className="brand">👗 STIKOM Store</a>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="/" className="nav-link-custom">Home</a>
              <a href="/products" className="nav-link-custom">Produk</a>
              <a href="/cart" className="nav-link-custom">🛒 Cart</a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}

        {/* Footer */}
        <footer className="footer-custom">
          <p>© 2025 STIKOM Store · Semua hak dilindungi</p>
        </footer>
      </body>
    </html>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <h1 className="hero-title">✨ STIKOM Store</h1>
        <p className="hero-subtitle">Temukan koleksi baju terbaik dengan harga terjangkau</p>
        <Link href="/products" className="btn-cream">
          Lihat Koleksi
        </Link>
      </section>

      {/* Info cards */}
      <div className="page-wrapper">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
          {[
            { icon: "🚚", title: "Gratis Ongkir", desc: "Untuk semua pembelian di atas Rp 100.000" },
            { icon: "🔄", title: "Easy Return", desc: "Pengembalian mudah dalam 7 hari" },
            { icon: "💳", title: "Bayar Aman", desc: "Berbagai metode pembayaran tersedia" },
            { icon: "⭐", title: "Produk Pilihan", desc: "Hanya koleksi terbaik dan terpercaya" },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: "var(--cream-card)",
                border: "2px solid var(--border)",
                borderRadius: 16,
                padding: "28px 22px",
                textAlign: "center",
                boxShadow: "var(--shadow)",
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: 10 }}>{item.icon}</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--brown-dark)", marginBottom: 6 }}>{item.title}</h3>
              <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { setProducts(data); setLoading(false); });
  }, []);

  async function addToCart(product_id) {
    setAdding(product_id);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id, qty: 1 }),
    });
    setAdding(null);
    alert("✅ Produk berhasil ditambahkan ke cart!");
  }

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">Koleksi Produk</h1>
      <div className="page-title-underline"></div>

      <div className="products-grid">
        {products.map((prod) => (
          <div key={prod.id} className="product-card">
            <img
              src={`/images/${prod.gambar}`}
              alt={prod.nama}
              className="product-card-img"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/300x240/f5f0e8/6b4f3a?text=No+Image";
              }}
            />
            <div className="product-card-body">
              <h2 className="product-name">{prod.nama}</h2>
              <p className="product-price">
                Rp {Number(prod.harga).toLocaleString("id-ID")}
              </p>
              <p className="product-desc">{prod.deskripsi}</p>
              <button
                className="btn-brown"
                onClick={() => addToCart(prod.id)}
                disabled={adding === prod.id}
                style={{ opacity: adding === prod.id ? 0.7 : 1 }}
              >
                {adding === prod.id ? "Menambahkan..." : "🛒 Tambah ke Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

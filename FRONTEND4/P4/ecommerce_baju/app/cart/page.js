"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cart")
      .then(res => res.json())
      .then(data => { setCart(data); setLoading(false); });
  }, []);

  const total = cart.reduce((sum, item) => sum + Number(item.harga) * item.qty, 0);

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
        <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Memuat cart...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <h1 className="page-title">🛒 Cart Belanja</h1>
      <div className="page-title-underline"></div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛍️</div>
          <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--brown-dark)", marginBottom: 8 }}>
            Cart masih kosong
          </p>
          <p style={{ marginBottom: 24 }}>Yuk, tambahkan produk ke cart kamu!</p>
          <Link href="/products" className="btn-cream" style={{ border: "2px solid var(--brown)", color: "var(--brown-dark)" }}>
            Lihat Produk
          </Link>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <p className="cart-item-name">{item.nama}</p>
                <p className="cart-item-detail">Jumlah: {item.qty} pcs</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="cart-item-price">
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Subtotal: Rp {(Number(item.harga) * item.qty).toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          ))}

          {/* Total */}
          <div style={{
            background: "linear-gradient(135deg, var(--brown-dark), var(--brown))",
            color: "var(--cream)",
            borderRadius: 16,
            padding: "22px 26px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 24,
            boxShadow: "0 6px 24px rgba(107,79,58,0.3)",
          }}>
            <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>Total Pembayaran</span>
            <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              Rp {total.toLocaleString("id-ID")}
            </span>
          </div>

          <div style={{ marginTop: 20, textAlign: "right" }}>
            <Link href="/products" className="btn-cream">
              ← Lanjut Belanja
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

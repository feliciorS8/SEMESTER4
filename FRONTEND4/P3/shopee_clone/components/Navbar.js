"use client";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="navbar navbar-expand-lg sticky-top" style={{ backgroundColor: "#ee4d2d" }}>
      <div className="container">
        {/* Logo */}
        <Link href="/" className="navbar-brand text-white fw-bold fs-3 me-4" style={{ fontStyle: "italic" }}>
          shopee
        </Link>

        {/* Search Bar */}
        <div className="flex-grow-1 me-3">
          <div className="input-group">
            <input
              type="search"
              className="form-control"
              placeholder="Cari produk di Shopee"
            />
            <button className="btn btn-warning px-3" type="button">
              🔍
            </button>
          </div>
        </div>

        {/* Cart Icon */}
        <Link href="/cart" className="btn btn-light position-relative">
          🛒 Keranjang
          {totalItems > 0 && (
            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
              style={{ backgroundColor: "#ee4d2d", fontSize: "10px" }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

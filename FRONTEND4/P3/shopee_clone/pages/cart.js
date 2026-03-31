import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function Cart() {
  const { cart, removeFromCart, totalPrice, clearCart } = useCart();

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }} className="py-4">
      <div className="container">
        <h5 className="fw-bold mb-4">🛒 Keranjang Belanja</h5>

        {cart.length === 0 ? (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <p className="fs-1">🛒</p>
            <p className="text-muted mb-3">Keranjangmu masih kosong</p>
            <Link href="/" className="btn" style={{ backgroundColor: "#ee4d2d", color: "white" }}>
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="card mb-3 border-0 shadow-sm">
                <div className="card-body d-flex align-items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div className="flex-grow-1">
                    <p className="mb-0 fw-semibold">{item.name}</p>
                    <p className="mb-0" style={{ color: "#ee4d2d" }}>
                      Rp {item.price.toLocaleString("id-ID")} × {item.qty}
                    </p>
                    <p className="mb-0 text-muted small">
                      Subtotal: Rp {(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="card border-0 shadow-sm mt-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total Pembayaran</span>
                <span className="fw-bold fs-5" style={{ color: "#ee4d2d" }}>
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-outline-secondary flex-grow-1"
                onClick={clearCart}
              >
                Kosongkan Keranjang
              </button>
              <button
                className="btn flex-grow-1"
                style={{ backgroundColor: "#ee4d2d", color: "white" }}
              >
                Beli Sekarang
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

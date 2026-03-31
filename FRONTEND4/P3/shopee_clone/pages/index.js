import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const products = [
  { id: 1, name: "Kemeja Pria Casual", price: 89000, image: "/images/p1.jpg", sold: 1200, desc: "Kemeja pria casual berkualitas tinggi, cocok untuk berbagai kesempatan." },
  { id: 2, name: "Sepatu Sneakers", price: 299000, image: "/images/p2.jpg", sold: 856, desc: "Sepatu sneakers trendy dan nyaman dipakai sehari-hari." },
  { id: 3, name: "Tas Ransel Modern", price: 159000, image: "/images/p3.jpg", sold: 2341, desc: "Tas ransel kapasitas besar, cocok untuk kerja dan kuliah." },
  { id: 4, name: "Jam Tangan Stylish", price: 459000, image: "/images/p4.jpg", sold: 534, desc: "Jam tangan stylish dengan bahan premium tahan lama." },
];

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Banner */}
      <div style={{ backgroundColor: "#ee4d2d" }} className="py-3 mb-3">
        <div className="container">
          <p className="text-white mb-0 text-center fw-semibold">
            🎉 Gratis Ongkir untuk semua produk hari ini!
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container pb-5">
        <h5 className="mb-3 fw-bold text-secondary">⚡ Flash Sale</h5>
        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-6 col-md-3">
              <div className="card h-100 shadow-sm border-0 product-card">
                <Link href={`/product/${product.id}`} className="text-decoration-none">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </Link>
                <div className="card-body d-flex flex-column p-2">
                  <p className="card-text fw-semibold small mb-1 text-dark">{product.name}</p>
                  <p className="fw-bold mb-1" style={{ color: "#ee4d2d" }}>
                    Rp {product.price.toLocaleString("id-ID")}
                  </p>
                  <p className="text-muted" style={{ fontSize: "12px" }}>
                    {product.sold.toLocaleString()} terjual
                  </p>
                  <button
                    className="btn btn-sm mt-auto w-100"
                    style={{ backgroundColor: "#ee4d2d", color: "white", fontSize: "13px" }}
                    onClick={() => addToCart(product)}
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

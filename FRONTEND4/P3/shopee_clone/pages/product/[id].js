import { useRouter } from "next/router";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

const products = [
  { id: 1, name: "Kemeja Pria Casual", price: 89000, image: "/images/p1.jpg", sold: 1200, desc: "Kemeja pria casual berkualitas tinggi, cocok untuk berbagai kesempatan. Bahan lembut dan adem seharian." },
  { id: 2, name: "Sepatu Sneakers", price: 299000, image: "/images/p2.jpg", sold: 856, desc: "Sepatu sneakers trendy dan nyaman dipakai sehari-hari. Sol anti slip dan ringan." },
  { id: 3, name: "Tas Ransel Modern", price: 159000, image: "/images/p3.jpg", sold: 2341, desc: "Tas ransel kapasitas besar, cocok untuk kerja dan kuliah. Tersedia kompartemen laptop." },
  { id: 4, name: "Jam Tangan Stylish", price: 459000, image: "/images/p4.jpg", sold: 534, desc: "Jam tangan stylish dengan bahan premium tahan lama. Water resistant hingga 30 meter." },
];

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">Produk tidak ditemukan</p>
        <Link href="/" className="btn" style={{ backgroundColor: "#ee4d2d", color: "white" }}>
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    router.push("/cart");
  };

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }} className="py-4">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-3">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link href="/" className="text-decoration-none" style={{ color: "#ee4d2d" }}>
                Beranda
              </Link>
            </li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="row g-4">
              {/* Gambar Produk */}
              <div className="col-md-5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
                />
              </div>

              {/* Detail Produk */}
              <div className="col-md-7">
                <h5 className="fw-bold">{product.name}</h5>
                <p className="text-muted small mb-2">⭐ 4.8 | {product.sold.toLocaleString()} terjual</p>
                <div className="py-3 px-3 rounded mb-3" style={{ backgroundColor: "#fff5f5" }}>
                  <h3 className="mb-0 fw-bold" style={{ color: "#ee4d2d" }}>
                    Rp {product.price.toLocaleString("id-ID")}
                  </h3>
                </div>
                <hr />
                <p className="text-muted">{product.desc}</p>
                <hr />
                <div className="d-flex gap-2">
                  <button
                    className="btn flex-grow-1"
                    style={{ backgroundColor: "#ffebe9", color: "#ee4d2d", border: "1px solid #ee4d2d" }}
                    onClick={() => addToCart(product)}
                  >
                    🛒 + Keranjang
                  </button>
                  <button
                    className="btn flex-grow-1"
                    style={{ backgroundColor: "#ee4d2d", color: "white" }}
                    onClick={handleAddToCart}
                  >
                    Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

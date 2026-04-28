import Link from 'next/link';

export default function ProductCard({ product }) {
  return (
    <div className="card p-2">
      <img src={product.image} height="200" />
      <h5>{product.name}</h5>
      <p>Rp {product.price}</p>
      <Link href={`/product/${product._id}`} className="btn btn-primary">
        Detail
      </Link>
    </div>
  );
}

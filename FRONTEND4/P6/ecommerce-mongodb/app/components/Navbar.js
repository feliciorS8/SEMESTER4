import Link from 'next/link';
import { useCart } from './CartContext';

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="navbar navbar-dark bg-dark p-3">
      <div className="container">
        <Link href="/" className="navbar-brand">MyShop</Link>
        <Link href="/cart" className="btn btn-light">
          Cart ({cart.length})
        </Link>
      </div>
    </nav>
  );
}

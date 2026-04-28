// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from '../app/components/CartContext';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

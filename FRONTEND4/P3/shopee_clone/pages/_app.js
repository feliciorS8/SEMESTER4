import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Navbar />
      <Component {...pageProps} />
    </CartProvider>
  );
}

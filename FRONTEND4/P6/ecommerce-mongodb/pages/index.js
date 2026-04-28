import Navbar from '../app/components/Navbar';
import ProductCard from '../app/components/ProductCard';

export default function Home({ products }) {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          {products.map(p => (
            <div className="col-md-4" key={p._id}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.BASE_URL + '/api/products');
  const products = await res.json();

  return { props: { products } };
}

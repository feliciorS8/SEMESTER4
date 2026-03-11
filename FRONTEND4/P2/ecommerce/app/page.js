import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <h1>E-Commerce Dengan Next.js</h1>
      <div style={{ display: "flex", gap: 20 }}>
        {products.map((prod) => (
          <div key={prod.id} style={{ border: "1px solid #ccc", padding: 20 }}>
            <img src={`/images/${prod.gambar}`} width={150} alt={prod.nama} />
            <h3>{prod.nama}</h3>
            <p>Rp {prod.harga}</p>
            <p>{prod.deskripsi}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

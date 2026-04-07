// app/api/cart/route.js
import { query } from "@/lib/db";

export async function POST(req) {
  const { product_id, qty } = await req.json();

  await query(
    "INSERT INTO cart (product_id, qty) VALUES (?, ?)",
    [product_id, qty]
  );

  return Response.json({ message: "Added to cart" });
}

export async function GET() {
  const rows = await query(`
    SELECT c.*, p.nama, p.harga
    FROM cart c
    JOIN products p ON p.id = c.product_id
  `);
  return Response.json(rows);
}

// app/api/products/route.js
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query("SELECT * FROM products");
  return Response.json(rows);
}


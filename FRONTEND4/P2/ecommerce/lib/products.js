import { connect } from "@/lib/db";

export async function getProducts() {
  const db = await connect();
  try {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  } finally {
    await db.end();
  }
}

import { getProducts } from "@/lib/products";

export async function GET() {
  try {
    const rows = await getProducts();
    return Response.json(rows);
  } catch (error) {
    return Response.json(
      { error: "Gagal mengambil data produk", detail: error.message },
      { status: 500 }
    );
  }
}

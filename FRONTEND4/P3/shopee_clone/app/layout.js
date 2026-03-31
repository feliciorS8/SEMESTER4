export const metadata = {
  title: "Shopee Clone",
  description: "Shopee Clone dengan Next.js dan Bootstrap",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}

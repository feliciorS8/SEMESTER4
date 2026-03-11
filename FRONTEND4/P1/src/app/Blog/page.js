//src/app/Blog/page.js

export default function BlogPage() {
  const posts = [
    { slug: "post-1", title: "Post Pertama" },
    { slug: "post-2", title: "Post Kedua" },
    { slug: "post-3", title: "Post Ketiga" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>Blog</h1>
      <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
        {posts.map((post) => (
          <div
            key={post.slug}
            style={{
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            <a
              href={`/Blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h2 style={{ marginBottom: "0.5rem" }}>{post.title}</h2>
              <p>Baca selengkapnya →</p>
            </a>
          </div>
        ))}
      </div>
      <a
        href="/"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "white",
          borderRadius: "0.25rem",
          textDecoration: "none",
        }}
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}

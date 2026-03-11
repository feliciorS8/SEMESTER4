export default function HomePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
        Selamat Datang
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Ini adalah halaman utama dari aplikasi Next.js
      </p>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <a
          href="/About"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: "0.25rem",
            textDecoration: "none",
          }}
        >
          About
        </a>
        <a
          href="/Blog"
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#0070f3",
            color: "white",
            borderRadius: "0.25rem",
            textDecoration: "none",
          }}
        >
          Blog
        </a>
      </nav>
    </div>
  );
}

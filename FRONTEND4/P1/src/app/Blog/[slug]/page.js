// src/app/blog/[slug]/page.js

export default function BlogPostPage({ params }) {
  const { slug } = params;

  return (
    <div>
      <h1>Post Blog: {slug}</h1>
      <p>Konten detail untuk post dengan slug: *{slug}*</p>
    </div>
  );
}

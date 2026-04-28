import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  let data = { stats: { total_dokter: 0, total_poli: 0, total_reservasi: 0 }, polis: [], dokters: [] };
  
  try {
    const res = await fetch("http://localhost:5000/api/home", { cache: "no-store" });
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
  }

  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <section 
        className="relative rounded-3xl overflow-hidden shadow-xl bg-cover bg-center" 
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
      >
        <div className="absolute inset-0 bg-cyan-900/70 z-10" />
        <div className="relative z-20 px-8 py-20 md:py-32 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-white">
            Pelayanan Kesehatan Terbaik di <span className="text-cyan-300">Rumah Sakit Yasmin</span>
          </h1>
          <p className="text-lg md:text-xl text-cyan-50 mb-8 max-w-lg drop-shadow-md">
            Kami siap melayani Anda dengan tenaga medis profesional dan fasilitas yang lengkap.
          </p>
          <Link
            href="/reservasi"
            className="inline-block bg-white text-cyan-800 font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-cyan-50 hover:scale-105 transition-all outline-none ring-2 ring-transparent focus:ring-cyan-300"
          >
            Buat Reservasi Sekarang
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-10 max-w-5xl mx-auto w-full px-4 relative z-30">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center space-x-6 border-b-4 border-cyan-500">
          <div className="p-4 bg-cyan-100 text-cyan-600 rounded-full text-3xl">👨‍⚕️</div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Dokter</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.total_dokter}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center space-x-6 border-b-4 border-cyan-500">
          <div className="p-4 bg-cyan-100 text-cyan-600 rounded-full text-3xl">🏥</div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Poli Layanan</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.total_poli}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center space-x-6 border-b-4 border-cyan-500">
          <div className="p-4 bg-cyan-100 text-cyan-600 rounded-full text-3xl">📝</div>
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Reservasi</p>
            <p className="text-3xl font-bold text-gray-900">{data.stats.total_reservasi}</p>
          </div>
        </div>
      </section>

      {/* Poli Section */}
      <section id="poli">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10 relative">
          Poli Layanan Kami
          <span className="block w-16 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.polis.map((poli) => (
            <div key={poli.id} className="bg-white border hover:border-cyan-500 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏷️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{poli.nama_poli}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{poli.deskripsi}</p>
              </div>
            </div>
          ))}
          {data.polis.length === 0 && (
            <div className="col-span-full text-center text-gray-500">Tidak ada data poli saat ini.</div>
          )}
        </div>
      </section>

      {/* Dokter Section */}
      <section id="dokter">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10 relative">
          Dokter Spesialis
          <span className="block w-16 h-1 bg-cyan-500 mx-auto mt-4 rounded-full"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.dokters.map((dokter) => (
            <div key={dokter.id} className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all overflow-hidden flex flex-col group">
              <div className="relative h-64 bg-gray-200 overflow-hidden">
                <img 
                  src={`http://localhost:5000/static/images/doctors/${dokter.foto || "default-doctor.jpg"}`} 
                  alt={dokter.nama_dokter}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-grow">
                <p className="text-cyan-600 font-semibold text-xs tracking-wider uppercase mb-1">{dokter.nama_poli || "Umum"}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{dokter.nama_dokter}</h3>
                <p className="text-gray-500 text-sm mb-3">{dokter.spesialisasi}</p>
                
                <div className="text-sm border-t pt-3 space-y-1 mb-3">
                  <p className="flex items-center text-gray-600">
                    <span className="mr-2">📅</span> {dokter.jadwal_hari}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <span className="mr-2">⏰</span> {dokter.jadwal_jam}
                  </p>
                </div>
                <div className="pt-2 border-t mt-auto">
                   <p className="text-sm text-gray-500">Tarif Konsultasi</p>
                   <p className="text-xl font-bold text-cyan-600">{dokter.harga_jual ? `Rp ${parseInt(dokter.harga_jual).toLocaleString('id-ID')}` : 'Gratis'}</p>
                </div>
              </div>
            </div>
          ))}
          {data.dokters.length === 0 && (
            <div className="col-span-full text-center text-gray-500">Tidak ada data dokter saat ini.</div>
          )}
        </div>
      </section>
    </div>
  );
}

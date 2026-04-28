"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Reservasi() {
  const router = useRouter();
  const [polis, setPolis] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nama_pasien: "",
    no_wa: "",
    poli_id: "",
    dokter_id: "",
    tanggal: "",
    keluhan: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/home")
      .then(res => res.json())
      .then(data => {
        setPolis(data.polis);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (formData.poli_id) {
      fetch(`http://localhost:5000/api/dokter/${formData.poli_id}`)
        .then(res => res.json())
        .then(data => {
          setDokters(data);
          setFormData(prev => ({ ...prev, dokter_id: "" })); // reset dokter when poli changes
        });
    } else {
      setDokters([]);
    }
  }, [formData.poli_id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/reservasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await res.json();
      
      if (res.ok) {
        const d = result.data;
        const pesan = `Halo, saya ingin reservasi:\n\nNama: ${d.nama_pasien}\nPoli: ${d.poli_name}\nDokter: ${d.nama_dokter}\nTanggal: ${d.tanggal}\nKeluhan: ${d.keluhan}\n\nTerima kasih!`;
        const encodedPesan = encodeURI(pesan);
        // Normlize WA inside backend, or just frontend
        let waNumber = d.no_wa_dokter || "6282338530825"; // default fallback
        waNumber = waNumber.replace(/\D/g, "");
        if (waNumber.startsWith("0")) waNumber = "62" + waNumber.substring(1);
        
        window.open(`https://wa.me/${waNumber}?text=${encodedPesan}`, "_blank");
        router.push("/");
      } else {
        alert("Gagal melakukan reservasi");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  };

  if (loading) return <div className="text-center py-20 text-cyan-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-cyan-500">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Reservasi</h1>
          <p className="text-gray-600">Isi form di bawah ini untuk membuat janji temu dengan dokter kami.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nama Pasien</label>
              <input 
                type="text" 
                name="nama_pasien" 
                required 
                value={formData.nama_pasien}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">No. WhatsApp</label>
              <input 
                type="text" 
                name="no_wa" 
                required 
                value={formData.no_wa}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                placeholder="Contoh: 08123456789"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pilih Poli</label>
              <select 
                name="poli_id" 
                required 
                value={formData.poli_id}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none bg-white"
              >
                <option value="">-- Pilih Poli --</option>
                {polis.map(p => (
                  <option key={p.id} value={p.id}>{p.nama_poli}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pilih Dokter</label>
              <select 
                name="dokter_id" 
                required 
                value={formData.dokter_id}
                onChange={handleChange}
                disabled={!formData.poli_id}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none bg-white disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">-- Pilih Dokter --</option>
                {dokters.map(d => (
                  <option key={d.id} value={d.id}>{d.nama_dokter} ({d.jadwal_hari} {d.jadwal_jam})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Tanggal Janji Temu</label>
              <input 
                type="date" 
                name="tanggal" 
                required 
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Keluhan</label>
              <textarea 
                name="keluhan" 
                required 
                rows="4"
                value={formData.keluhan}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none resize-none"
                placeholder="Jelaskan keluhan Anda dengan singkat"
              ></textarea>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-1 focus:outline-none flex justify-center items-center gap-2"
            >
              <span>Kirim & Lanjutkan ke WhatsApp</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.927 2.809.927 3.182 0 5.769-2.586 5.769-5.766 0-3.181-2.587-5.769-5.769-5.769zm3.003 8.357c-.12.355-.664.673-.97.712-.303.037-.585.127-2.61-.715-2.4-1.002-3.921-3.486-4.043-3.649-.12-.162-.97-1.288-.97-2.457 0-1.171.611-1.748.835-1.996.223-.245.485-.306.65-.306.16 0 .324.004.469.012.146.008.341-.06.532.404.195.474.662 1.62.72 1.74.058.121.096.262.016.425-.08.163-.122.264-.243.406-.12.14-.251.306-.36.406-.12.122-.243.256-.11.488.134.233.596.986 1.278 1.597.876.786 1.611 1.03 1.844 1.152.235.122.373.102.511-.056.14-.158.601-.703.765-.945.163-.243.328-.203.541-.122.213.08 1.341.632 1.571.748.232.115.385.174.442.272.057.098.057.568-.063.923z"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

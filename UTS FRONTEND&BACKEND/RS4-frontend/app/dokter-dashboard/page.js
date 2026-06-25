"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DokterDashboard() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [dokterNama, setDokterNama] = useState("");
  const [pasien, setPasien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState({ from: "", to: "" });

  const statusLabel = (status) => {
    if (status === "confirmed") return "Periksa";
    if (status === "cancelled") return "Selesai";
    return "Registrasi";
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("dokterToken");
    if (!savedToken) {
      router.push("/dokter-login");
      return;
    }
    setToken(savedToken);
    setDokterNama(localStorage.getItem("dokterNama") || "Dokter");
  }, [router]);

  const fetchPasien = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const query = new URLSearchParams(filterTanggal).toString();
    const res = await fetch(`/api/dokter/pasien?${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      localStorage.removeItem("dokterToken");
      router.push("/dokter-login");
      return;
    }

    const data = await res.json();
    setPasien(data.data || []);
    setLoading(false);
  }, [token, filterTanggal, router]);

  useEffect(() => {
    fetchPasien();
  }, [fetchPasien]);

  const updatePasien = (id, patch) => {
    setPasien(prev => prev.map(row => row.id === id ? { ...row, ...patch } : row));
  };

  const simpanPasien = async (row, nextStatus = row.status) => {
    await fetch(`/api/dokter/pasien/${row.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: nextStatus, diagnosa: row.diagnosa || "" })
    });
    fetchPasien();
  };

  const logout = () => {
    localStorage.removeItem("dokterToken");
    localStorage.removeItem("dokterNama");
    router.push("/dokter-login");
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Dokter</h1>
          <p className="text-gray-500 mt-1">{dokterNama}</p>
        </div>
        <button onClick={logout} className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100">
          Logout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-5 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Dari tanggal</label>
          <input type="date" value={filterTanggal.from} onChange={e=>setFilterTanggal({...filterTanggal, from: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Sampai tanggal</label>
          <input type="date" value={filterTanggal.to} onChange={e=>setFilterTanggal({...filterTanggal, to: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="button" onClick={()=>setFilterTanggal({ from: "", to: "" })} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
          Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Pasien</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Tanggal</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Keluhan</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Diagnosa</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pasien.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <p className="font-bold text-gray-800">{row.nama_pasien}</p>
                  <p className="text-xs text-gray-500">WA: {row.no_wa}</p>
                </td>
                <td className="px-4 py-4">{row.tanggal_reservasi ? new Date(row.tanggal_reservasi).toLocaleDateString("id-ID") : "-"}</td>
                <td className="px-4 py-4 max-w-xs">{row.keluhan || "-"}</td>
                <td className="px-4 py-4 min-w-72">
                  <textarea
                    value={row.diagnosa || ""}
                    onChange={e=>updatePasien(row.id, { diagnosa: e.target.value })}
                    rows="3"
                    placeholder="Isi hasil diagnosa"
                    className="w-full border rounded p-2 text-xs outline-none focus:border-cyan-500 resize-none"
                  />
                </td>
                <td className="px-4 py-4">
                  <select
                    value={row.status}
                    onChange={e=>updatePasien(row.id, { status: e.target.value })}
                    className={`text-xs px-2 py-1 rounded border outline-none ${row.status==='confirmed'?'bg-green-100 text-green-800 border-green-200':(row.status==='pending'?'bg-yellow-100 text-yellow-800 border-yellow-200':'bg-blue-100 text-blue-800 border-blue-200')}`}
                  >
                    <option value="pending">Registrasi</option>
                    <option value="confirmed">Periksa</option>
                    <option value="cancelled">Selesai</option>
                  </select>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={()=>simpanPasien(row, row.status)} className="bg-cyan-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-cyan-700">
                    Simpan
                  </button>
                </td>
              </tr>
            ))}
            {!loading && pasien.length === 0 && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada pasien pada range tanggal ini</td></tr>
            )}
            {loading && (
              <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Memuat data pasien...</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

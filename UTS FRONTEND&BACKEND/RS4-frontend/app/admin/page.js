"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminConsole() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [stats, setStats] = useState({ total_dokter: 0, total_poli: 0, total_reservasi: 0, total_pendapatan: 0, total_dokter_cut: 0, total_sistem_cut: 0, revenue_harian: [] });
  const [polis, setPolis] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [reservasis, setReservasis] = useState([]);
  const [laporanDokter, setLaporanDokter] = useState([]);
  const [rekapPasien, setRekapPasien] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState({ from: "", to: "" });
  
  // Pagination state
  const [poliPage, setPoliPage] = useState(1);
  const [poliPagination, setPoliPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [dokterPage, setDokterPage] = useState(1);
  const [dokterPagination, setDokterPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [reservasiPage, setReservasiPage] = useState(1);
  const [reservasiPagination, setReservasiPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [allPolis, setAllPolis] = useState([]); // for dokter dropdown
  
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "dashboard") {
        const res = await fetch("/api/admin/dashboard", { headers: { "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        // Transform data for recharts
        const chartData = data.revenue_harian.map(d => ({
          name: new Date(d.tanggal).toLocaleDateString("id-ID", {day: "numeric", month: "short"}),
          PendapatanRumahSakit: d.pendapatan_sistem || 0,
          PendapatanDokter: d.pendapatan_dokter || 0
        })).reverse(); // reverse so oldest is first
        setStats({ ...data, chartData });
      } else if (activeTab === "poli") {
        const res = await fetch(`/api/admin/poli?page=${poliPage}&limit=5`, { headers: { "Authorization": `Bearer ${token}` } });
        const result = await res.json();
        setPolis(result.data);
        setPoliPagination(result.pagination);
      } else if (activeTab === "dokter") {
        const res = await fetch(`/api/admin/dokter?page=${dokterPage}&limit=5`, { headers: { "Authorization": `Bearer ${token}` } });
        const result = await res.json();
        setDokters(result.data);
        setDokterPagination(result.pagination);
        // Fetch ALL polis for the dropdown (no pagination)
        const resPoli = await fetch(`/api/admin/poli?page=1&limit=100`, { headers: { "Authorization": `Bearer ${token}` } });
        const poliResult = await resPoli.json();
        setAllPolis(poliResult.data);
      } else if (activeTab === "reservasi") {
        const res = await fetch(`/api/admin/reservasi?page=${reservasiPage}&limit=5`, { headers: { "Authorization": `Bearer ${token}` } });
        const result = await res.json();
        setReservasis(result.data);
        setReservasiPagination(result.pagination);
      } else if (activeTab === "laporan") {
        const rangeQuery = new URLSearchParams(filterTanggal).toString();
        const res = await fetch(`/api/admin/laporan-dokter?${rangeQuery}`, { headers: { "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error("Unauthorized");
        const result = await res.json();
        setLaporanDokter(result.data || []);
      } else if (activeTab === "rekap") {
        const rangeQuery = new URLSearchParams(filterTanggal).toString();
        const res = await fetch(`/api/admin/rekap-pasien?${rangeQuery}`, { headers: { "Authorization": `Bearer ${token}` } });
        if (!res.ok) throw new Error("Unauthorized");
        const result = await res.json();
        setRekapPasien(result.data || []);
      }
    } catch (err) {
      if(err.message === "Unauthorized") {
         localStorage.removeItem("token");
         router.push("/login");
      }
    }
    setLoading(false);
  }, [token, activeTab, poliPage, dokterPage, reservasiPage, filterTanggal, router]);

  useEffect(() => {
    if (!token) return;
    fetchData();
  }, [token, activeTab, poliPage, dokterPage, reservasiPage, filterTanggal, fetchData]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  // POLI HANDLERS
  const [poliForm, setPoliForm] = useState({ id: null, nama_poli: "", deskripsi: "" });
  const handlePoliSubmit = async (e) => {
    e.preventDefault();
    const url = poliForm.id ? `/api/admin/poli/${poliForm.id}` : `/api/admin/poli`;
    await fetch(url, {
      method: poliForm.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(poliForm)
    });
    setPoliForm({ id: null, nama_poli: "", deskripsi: "" });
    fetchData();
  };

  const handleDeletePoli = async (id) => {
    if(!confirm("Yakin hapus poli ini?")) return;
    await fetch(`/api/admin/poli/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    fetchData();
  };

  // DOKTER HANDLERS
  const [dokterForm, setDokterForm] = useState({ id: null, nama_dokter: "", spesialisasi: "", poli_id: "", jadwal_hari: "", jadwal_jam: "", no_wa: "", harga_beli: 0, harga_jual: 0, username: "", password: "", fotoFile: null });
  const handleDokterSubmit = async (e) => {
    e.preventDefault();
    const url = dokterForm.id ? `/api/admin/dokter/${dokterForm.id}` : `/api/admin/dokter`;
    const fd = new FormData();
    for (const key in dokterForm) {
      if(key === 'fotoFile') {
         if (dokterForm.fotoFile) fd.append('foto', dokterForm.fotoFile);
      } else if(dokterForm[key]) {
         fd.append(key, dokterForm[key]);
      }
    }
    await fetch(url, { method: dokterForm.id ? "PUT" : "POST", headers: { "Authorization": `Bearer ${token}` }, body: fd });
    setDokterForm({ id: null, nama_dokter: "", spesialisasi: "", poli_id: "", jadwal_hari: "", jadwal_jam: "", no_wa: "", harga_beli: 0, harga_jual: 0, username: "", password: "", fotoFile: null });
    fetchData();
  };

  const handleDeleteDokter = async (id) => {
    if(!confirm("Yakin hapus dokter ini?")) return;
    await fetch(`/api/admin/dokter/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    fetchData();
  };

  // RESERVASI HANDLERS
  const updateStatusReservasi = async (id, status, diagnosa = "") => {
    await fetch(`/api/admin/reservasi/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ status, diagnosa })
    });
    fetchData();
  };

  const updateDiagnosaReservasi = (id, diagnosa) => {
    setReservasis(prev => prev.map(item => item.id === id ? { ...item, diagnosa } : item));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  }

  const exportLaporanDokterExcel = () => {
    const rows = laporanDokter.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.nama_dokter || ""}</td>
        <td>${row.spesialisasi || ""}</td>
        <td>${row.nama_poli || ""}</td>
        <td>${row.total_pasien || 0}</td>
        <td>${row.total_pendapatan || 0}</td>
        <td>${row.pendapatan_dokter || 0}</td>
        <td>${row.pendapatan_rs || 0}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head><meta charset="UTF-8" /></head>
        <body>
          <table border="1">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Dokter</th>
                <th>Spesialisasi</th>
                <th>Poli</th>
                <th>Total Pasien</th>
                <th>Total Pendapatan</th>
                <th>Pendapatan Dokter</th>
                <th>Pendapatan Rumah Sakit</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `laporan-pendapatan-dokter-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const statusLabel = (status) => {
    if (status === "confirmed") return "Periksa";
    if (status === "cancelled") return "Selesai";
    return "Registrasi";
  };

  const rekapSummary = {
    total: rekapPasien.length,
    registrasi: rekapPasien.filter(row => row.status === "pending").length,
    periksa: rekapPasien.filter(row => row.status === "confirmed").length,
    selesai: rekapPasien.filter(row => row.status === "cancelled").length,
    hangus: rekapPasien.filter(row => row.status === "pending" && row.tanggal_reservasi && new Date(row.tanggal_reservasi) < new Date(new Date().toDateString())).length
  };

  const DateRangeFilter = () => (
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
  );

  const exportRekapPasienExcel = () => {
    const rows = rekapPasien.map((row, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${row.nama_pasien || ""}</td>
        <td>${row.no_wa || ""}</td>
        <td>${row.tanggal_reservasi ? new Date(row.tanggal_reservasi).toLocaleDateString("id-ID") : ""}</td>
        <td>${row.nama_poli || ""}</td>
        <td>${row.nama_dokter || ""}</td>
        <td>${statusLabel(row.status)}</td>
        <td>${row.keluhan || ""}</td>
        <td>${row.diagnosa || ""}</td>
        <td>${row.harga_jual || 0}</td>
        <td>${row.harga_beli || 0}</td>
      </tr>
    `).join("");

    const html = `
      <html>
        <head><meta charset="UTF-8" /></head>
        <body>
          <table border="1">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pasien</th>
                <th>No WA</th>
                <th>Tanggal</th>
                <th>Poli</th>
                <th>Dokter Pemeriksa</th>
                <th>Status</th>
                <th>Keluhan</th>
                <th>Diagnosa</th>
                <th>Total Bayar Pasien</th>
                <th>Jatah Dokter</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rekap-history-pasien-${new Date().toISOString().slice(0, 10)}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Reusable Pagination Component
  const PaginationControls = ({ pagination, currentPage, setPage }) => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= pagination.totalPages; i++) pages.push(i);
    return (
      <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50 rounded-b-xl">
        <p className="text-sm text-gray-500">
          Menampilkan <span className="font-semibold">{((currentPage - 1) * pagination.limit) + 1}</span>–<span className="font-semibold">{Math.min(currentPage * pagination.limit, pagination.total)}</span> dari <span className="font-semibold">{pagination.total}</span> data
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => setPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          {pages.map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${p === currentPage ? 'bg-cyan-600 text-white border-cyan-600 shadow' : 'bg-white hover:bg-gray-100'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    );
  };

  if (loading && activeTab === "dashboard" && stats.total_dokter === 0) return <div className="text-center py-20 text-cyan-700 font-semibold">Memuat Data Admin...</div>;

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 mt-4 pb-20 relative">
      
      {/* MOBILE HAMBURGER TOGGLE */}
      <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl shadow-lg border-t-4 border-cyan-600 mb-2">
        <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-cyan-600 outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-64 bg-white p-6 rounded-2xl shadow-lg border-t-4 border-cyan-600 h-max md:sticky md:top-24 z-10`}>
        <h2 className="text-xl font-bold mb-6 text-gray-800 hidden md:block">Admin Panel</h2>
        <div className="space-y-2 flex flex-col">
          <button onClick={() => handleTabChange("dashboard")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="dashboard" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>📊 Dashboard</button>
          <button onClick={() => handleTabChange("poli")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="poli" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>🏷️ Kelola Poli</button>
          <button onClick={() => handleTabChange("dokter")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="dokter" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>👨‍⚕️ Kelola Dokter</button>
          <button onClick={() => handleTabChange("reservasi")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="reservasi" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>📝 Registrasi/Reservasi</button>
          <button onClick={() => handleTabChange("rekap")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="rekap" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>Rekap Pasien</button>
          <button onClick={() => handleTabChange("laporan")} className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab==="laporan" ? "bg-cyan-100 text-cyan-700" : "hover:bg-gray-100 text-gray-600"}`}>Laporan Dokter</button>
          <button onClick={logout} className="text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 mt-4 border border-transparent hover:border-red-200">🚪 Logout</button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 w-full overflow-hidden">
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 font-medium">Total Dokter</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_dokter}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-purple-500">
                <p className="text-sm text-gray-500 font-medium">Total Poli</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_poli}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-500">
                <p className="text-sm text-gray-500 font-medium">Total Reservasi</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_reservasi}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                <p className="text-sm text-gray-500 font-medium">Laba Kotor (Semua)</p>
                <p className="text-2xl font-bold text-gray-900">Rp {parseInt(stats.total_pendapatan).toLocaleString('id-ID')}</p>
              </div>
            </div>

            {/* BREAKDOWN REVENUE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
               <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pendapatan Bersih Rumah Sakit</h3>
                  <p className="text-4xl font-extrabold text-cyan-600 mt-2">Rp {parseInt(stats.total_sistem_cut).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-400 mt-1">Total (Harga Jual - Harga Beli Dokter)</p>
               </div>
               <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Pendapatan Dokter Spesialis</h3>
                  <p className="text-4xl font-extrabold text-red-500 mt-2">Rp {parseInt(stats.total_dokter_cut).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-400 mt-1">Total (Harga Beli dari semua Reservasi)</p>
               </div>
            </div>

            {/* DIAGRAMCHART */}
            <h2 className="text-xl font-bold text-gray-900 mb-4">Grafik Pendapatan (7 Hari Terakhir)</h2>
            <div className="bg-white p-4 rounded-xl shadow mb-8 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`} />
                  <Legend />
                  <Bar dataKey="PendapatanRumahSakit" fill="#0EA5E9" name="Bersih RS (Laba)" />
                  <Bar dataKey="PendapatanDokter" fill="#EF4444" name="Gaji Dokter" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tabel Pendapatan Detil (7 Hari Terakhir)</h2>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-600">Tanggal</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-center">Pasien</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-right">Gaji Dokter</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-right">Bersih RS</th>
                    <th className="px-6 py-3 font-semibold text-gray-600 text-right">Laba Kotor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.revenue_harian.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{new Date(row.tanggal).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-center">{row.total_pasien}</td>
                      <td className="px-6 py-4 text-right text-red-500">Rp {parseInt(row.pendapatan_dokter||0).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-right font-medium text-cyan-600">Rp {parseInt(row.pendapatan_sistem||0).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 text-right text-gray-600">Rp {parseInt(row.total_pendapatan||0).toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                  {stats.revenue_harian.length === 0 && (
                    <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data reservasi</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* ... (Poli UI remains same logic) ... */}
        {activeTab === "poli" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Kelola Poli</h1>
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h2 className="font-bold text-lg mb-4">{poliForm.id ? "Edit Poli" : "Tambah Poli Baru"}</h2>
              <form onSubmit={handlePoliSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nama Poli</label>
                  <input type="text" value={poliForm.nama_poli} onChange={e=>setPoliForm({...poliForm, nama_poli: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-cyan-500" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Deskripsi</label>
                  <input type="text" value={poliForm.deskripsi} onChange={e=>setPoliForm({...poliForm, deskripsi: e.target.value})} className="w-full border rounded p-2 text-sm outline-none focus:border-cyan-500" required />
                </div>
                <div className="md:col-span-2 pt-2 flex gap-2">
                  <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-700">{poliForm.id ? "Simpan Perubahan" : "Simpan Poli"}</button>
                  {poliForm.id && <button type="button" onClick={()=>setPoliForm({id:null, nama_poli:"", deskripsi:""})} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300">Batal</button>}
                </div>
              </form>
            </div>
            
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Poli</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {polis.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4"><p className="font-bold text-gray-800">{p.nama_poli}</p><p className="text-xs text-gray-500 truncate">{p.deskripsi}</p></td>
                      <td className="px-4 py-4 flex gap-2 justify-end">
                        <button onClick={()=>setPoliForm(p)} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Edit</button>
                        <button onClick={()=>handleDeletePoli(p.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationControls pagination={poliPagination} currentPage={poliPage} setPage={setPoliPage} />
            </div>
          </div>
        )}

        {activeTab === "dokter" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Kelola Dokter Spesialis</h1>
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h2 className="font-bold text-lg mb-4">{dokterForm.id ? "Edit Dokter" : "Tambah Dokter"}</h2>
              <form onSubmit={handleDokterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nama Dokter</label>
                  <input type="text" value={dokterForm.nama_dokter} onChange={e=>setDokterForm({...dokterForm, nama_dokter: e.target.value})} className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Spesialisasi</label>
                  <input type="text" value={dokterForm.spesialisasi} onChange={e=>setDokterForm({...dokterForm, spesialisasi: e.target.value})} className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Pilih Poli</label>
                  <select value={dokterForm.poli_id} onChange={e=>setDokterForm({...dokterForm, poli_id: e.target.value})} className="w-full border rounded p-2 text-sm bg-white" required>
                    <option value="">-- Pilih --</option>
                    {allPolis.map(p => <option key={p.id} value={p.id}>{p.nama_poli}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">No. WhatsApp</label>
                  <input type="text" value={dokterForm.no_wa} onChange={e=>setDokterForm({...dokterForm, no_wa: e.target.value})} className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Jadwal Hari</label>
                  <input type="text" value={dokterForm.jadwal_hari} onChange={e=>setDokterForm({...dokterForm, jadwal_hari: e.target.value})} placeholder="Senin - Rabu" className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Jadwal Jam</label>
                  <input type="text" value={dokterForm.jadwal_jam} onChange={e=>setDokterForm({...dokterForm, jadwal_jam: e.target.value})} placeholder="08:00 - 14:00" className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Tarif / Harga Jual Pasien (Tanpa Titik)</label>
                  <input type="number" value={dokterForm.harga_jual} onChange={e=>setDokterForm({...dokterForm, harga_jual: Number(e.target.value)})} placeholder="Contoh: 100000" className="w-full border rounded p-2 text-sm" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Jatah Dokter / Harga Beli (Tanpa Titik)</label>
                  <input type="number" value={dokterForm.harga_beli} onChange={e=>setDokterForm({...dokterForm, harga_beli: Number(e.target.value)})} placeholder="Contoh: 70000" className="w-full border rounded p-2 text-sm border-red-200" required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Username Login Dokter</label>
                  <input type="text" value={dokterForm.username || ""} onChange={e=>setDokterForm({...dokterForm, username: e.target.value})} placeholder="Contoh: dokterjenny" className="w-full border rounded p-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Password Dokter</label>
                  <input type="password" value={dokterForm.password || ""} onChange={e=>setDokterForm({...dokterForm, password: e.target.value})} placeholder={dokterForm.id ? "Kosongkan jika tidak diubah" : "Default: dokter123"} className="w-full border rounded p-2 text-sm" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Upload Foto Profil Dokter</label>
                  <input type="file" accept="image/*" onChange={e=>setDokterForm({...dokterForm, fotoFile: e.target.files[0]})} className="w-full border rounded p-2 text-sm bg-gray-50 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100" />
                </div>
                <div className="md:col-span-2 pt-2 flex gap-2">
                  <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-cyan-700">{dokterForm.id ? "Simpan Perubahan" : "Simpan Dokter"}</button>
                  {dokterForm.id && <button type="button" onClick={()=>setDokterForm({id:null, nama_dokter:"", spesialisasi:"", poli_id:"", jadwal_hari:"", jadwal_jam:"", no_wa:"", harga_beli:0, harga_jual:0, username:"", password:"", fotoFile:null})} className="bg-gray-200 text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-300">Batal</button>}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Dokter</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Poli</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Harga</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {dokters.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 flex items-center gap-3">
                         <img src={`/api/images/doctors/${d.foto||'default-doctor.jpg'}`} className="w-10 h-10 rounded-full object-cover" alt="" />
                         <div>
                            <p className="font-bold text-gray-800">{d.nama_dokter}</p>
                            <p className="text-xs text-gray-500">{d.spesialisasi} • WA: {d.no_wa}</p>
                            <p className="text-xs text-cyan-600">Login: {d.username || `dokter${d.id}`}</p>
                         </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{d.nama_poli}<br/><span className="text-gray-400">{d.jadwal_hari} {d.jadwal_jam}</span></td>
                      <td className="px-4 py-3 text-sm">
                        <span className="text-green-600 font-medium">Jual: Rp{d.harga_jual?.toLocaleString('id-ID')}</span><br/>
                        <span className="text-red-500 text-xs">Beli: Rp{d.harga_beli?.toLocaleString('id-ID')}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button onClick={()=>setDokterForm({...d, password: "", fotoFile: null})} className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded">Edit</button>
                        <button onClick={()=>handleDeleteDokter(d.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationControls pagination={dokterPagination} currentPage={dokterPage} setPage={setDokterPage} />
            </div>
          </div>
        )}

        {activeTab === "reservasi" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Manajemen Registrasi</h1>
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Pasien / Kontak</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Target Poli & Dokter</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Tanggal Rencana</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Diagnosa</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm text-right">Total Bayar</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservasis.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-800">{r.nama_pasien}</p>
                        <p className="text-xs text-gray-500">WA: {r.no_wa}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <p className="font-medium">{r.nama_poli}</p>
                        <p className="text-xs text-gray-500">Dr. {r.nama_dokter}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {r.tanggal_reservasi ? new Date(r.tanggal_reservasi).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm min-w-64">
                        <textarea
                          value={r.diagnosa || ""}
                          onChange={(e)=>updateDiagnosaReservasi(r.id, e.target.value)}
                          rows="2"
                          placeholder="Isi hasil diagnosa"
                          className="w-full border rounded p-2 text-xs outline-none focus:border-cyan-500 resize-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <p className="font-semibold text-gray-800">Rp {parseInt(r.harga_jual || 0).toLocaleString('id-ID')}</p>
                        <p className="text-xs text-gray-500">Dokter: Rp {parseInt(r.harga_beli || 0).toLocaleString('id-ID')}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <select 
                          value={r.status} 
                          onChange={(e)=>updateStatusReservasi(r.id, e.target.value, r.diagnosa)}
                          className={`text-xs px-2 py-1 rounded outline-none border ${r.status==='confirmed'?'bg-green-100 text-green-800 border-green-200':(r.status==='pending'?'bg-yellow-100 text-yellow-800 border-yellow-200':'bg-blue-100 text-blue-800 border-blue-200')}`}
                        >
                          <option value="pending">Registrasi</option>
                          <option value="confirmed">Periksa</option>
                          <option value="cancelled">Selesai</option>
                        </select>
                        <button
                          onClick={()=>updateStatusReservasi(r.id, r.status, r.diagnosa)}
                          className="block mt-2 text-xs bg-cyan-600 text-white px-2 py-1 rounded hover:bg-cyan-700"
                        >
                          Simpan Diagnosa
                        </button>
                      </td>
                    </tr>
                  ))}
                  {reservasis.length === 0 && (
                     <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data reservasi</td></tr>
                  )}
                </tbody>
              </table>
              <PaginationControls pagination={reservasiPagination} currentPage={reservasiPage} setPage={setReservasiPage} />
            </div>
          </div>
        )}

        {activeTab === "rekap" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Rekap History Pasien</h1>
                <p className="text-sm text-gray-500 mt-1">Data pasien, tanggal, dokter pemeriksa, diagnosa, status, dan pembayaran.</p>
              </div>
              <button
                onClick={exportRekapPasienExcel}
                disabled={rekapPasien.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Excel
              </button>
            </div>

            <DateRangeFilter />

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-gray-500">
                <p className="text-xs text-gray-500 font-medium">Total Pasien</p>
                <p className="text-2xl font-bold text-gray-900">{rekapSummary.total}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-yellow-500">
                <p className="text-xs text-gray-500 font-medium">Registrasi</p>
                <p className="text-2xl font-bold text-gray-900">{rekapSummary.registrasi}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                <p className="text-xs text-gray-500 font-medium">Periksa</p>
                <p className="text-2xl font-bold text-gray-900">{rekapSummary.periksa}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-500">
                <p className="text-xs text-gray-500 font-medium">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">{rekapSummary.selesai}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
                <p className="text-xs text-gray-500 font-medium">Belum Datang/Hangus</p>
                <p className="text-2xl font-bold text-gray-900">{rekapSummary.hangus}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Pasien</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Tanggal</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Dokter</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Diagnosa</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Total Bayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rekapPasien.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-800">{row.nama_pasien}</p>
                        <p className="text-xs text-gray-500">WA: {row.no_wa}</p>
                      </td>
                      <td className="px-4 py-4">{row.tanggal_reservasi ? new Date(row.tanggal_reservasi).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-4 py-4">
                        <p className="font-medium">{row.nama_dokter || "-"}</p>
                        <p className="text-xs text-gray-500">{row.nama_poli || "-"}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-xs px-2 py-1 rounded border ${row.status==='confirmed'?'bg-green-100 text-green-800 border-green-200':(row.status==='pending'?'bg-yellow-100 text-yellow-800 border-yellow-200':'bg-blue-100 text-blue-800 border-blue-200')}`}>
                          {statusLabel(row.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs">
                        <p className="text-gray-700">{row.diagnosa || "-"}</p>
                        <p className="text-xs text-gray-400 mt-1">Keluhan: {row.keluhan || "-"}</p>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="font-semibold text-gray-800">Rp {parseInt(row.harga_jual || 0).toLocaleString("id-ID")}</p>
                        <p className="text-xs text-gray-500">Jatah dokter: Rp {parseInt(row.harga_beli || 0).toLocaleString("id-ID")}</p>
                      </td>
                    </tr>
                  ))}
                  {rekapPasien.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Belum ada history pasien</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "laporan" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Laporan Pendapatan Dokter</h1>
                <p className="text-sm text-gray-500 mt-1">Ringkasan pendapatan dari reservasi yang masuk untuk tiap dokter.</p>
              </div>
              <button
                onClick={exportLaporanDokterExcel}
                disabled={laporanDokter.length === 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download Excel
              </button>
            </div>

            <DateRangeFilter />

            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-600">Dokter</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Poli</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-center">Pasien</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Total Pendapatan</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Pendapatan Dokter</th>
                    <th className="px-4 py-3 font-semibold text-gray-600 text-right">Pendapatan RS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {laporanDokter.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-bold text-gray-800">{row.nama_dokter}</p>
                        <p className="text-xs text-gray-500">{row.spesialisasi}</p>
                      </td>
                      <td className="px-4 py-4">{row.nama_poli || "-"}</td>
                      <td className="px-4 py-4 text-center">{row.total_pasien}</td>
                      <td className="px-4 py-4 text-right">Rp {parseInt(row.total_pendapatan || 0).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-4 text-right font-semibold text-red-500">Rp {parseInt(row.pendapatan_dokter || 0).toLocaleString("id-ID")}</td>
                      <td className="px-4 py-4 text-right font-semibold text-cyan-600">Rp {parseInt(row.pendapatan_rs || 0).toLocaleString("id-ID")}</td>
                    </tr>
                  ))}
                  {laporanDokter.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">Belum ada data pendapatan dokter</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

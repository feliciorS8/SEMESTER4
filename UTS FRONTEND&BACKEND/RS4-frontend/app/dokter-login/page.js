"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DokterLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/dokter/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login dokter gagal");
        return;
      }

      localStorage.setItem("dokterToken", data.token);
      localStorage.setItem("dokterNama", data.dokter.nama_dokter);
      router.push("/dokter-dashboard");
    } catch (err) {
      setError("Kesalahan koneksi ke server.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border-t-4 border-cyan-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Login Dokter</h2>
          <p className="text-gray-500 mt-2">Masuk untuk melihat pasien dan mengisi diagnosa.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username Dokter</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={e=>setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="Contoh: dokter7"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={e=>setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              placeholder="Password dokter"
            />
          </div>
          <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-xl shadow-lg">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-cyan-600 shadow-lg text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center font-bold text-xl drop-shadow-md">
              🏥 RS Yasmin
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link href="/" className="hover:text-cyan-200 hover:border-cyan-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors">Beranda</Link>
              <Link href="/#poli" className="hover:text-cyan-200 hover:border-cyan-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors">Poli</Link>
              <Link href="/#dokter" className="hover:text-cyan-200 hover:border-cyan-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors">Dokter</Link>
              <Link href="/reservasi" className="hover:text-cyan-200 hover:border-cyan-200 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium transition-colors">Reservasi</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center">
             <Link href="/login" className="bg-white text-cyan-600 hover:bg-cyan-50 px-4 py-2 rounded-md text-sm font-medium shadow transition">Login / Admin</Link>
          </div>
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-cyan-200 focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cyan-700 pb-4 px-4 space-y-2">
          <Link href="/" onClick={()=>setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-cyan-600">Beranda</Link>
          <Link href="/#poli" onClick={()=>setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-cyan-600">Poli</Link>
          <Link href="/#dokter" onClick={()=>setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-cyan-600">Dokter</Link>
          <Link href="/reservasi" onClick={()=>setIsOpen(false)} className="block px-3 py-2 rounded-md font-medium hover:bg-cyan-600">Reservasi</Link>
          <Link href="/login" onClick={()=>setIsOpen(false)} className="block mt-4 text-center bg-white text-cyan-700 px-3 py-2 rounded-md font-medium shadow">Login / Admin</Link>
        </div>
      )}
    </nav>
  );
}

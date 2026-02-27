"use client";

import { IslamicPattern } from "@/components/fikris";
import { useNavigation } from "@/store/navigation";
import Link from "next/link";

export function HeroSection() {
  const { setView } = useNavigation();

  return (
    <section id="beranda" className="relative overflow-hidden py-16 md:py-24">
      {/* Background pattern */}
      <IslamicPattern variant="geometric" opacity={0.03} />
      
      <div className="container mx-auto px-4 text-center relative">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Kelola Remaja Masjid dengan{" "}
            <span className="text-emerald-600">Modern</span> dan{" "}
            <span className="text-amber-500">Mudah</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Fikris hadir sebagai solusi digital untuk mengelola kegiatan, 
            keuangan, dan keanggotaan remaja masjid secara terintegrasi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/auth/signin"
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300"
            >
              Masuk Dasbor
            </Link>
            <a
              href="#pendaftaran"
              className="px-8 py-3 bg-white hover:bg-gray-50 text-emerald-700 font-medium rounded-lg border-2 border-emerald-200 transition-all"
            >
              Daftar Jadi Anggota
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

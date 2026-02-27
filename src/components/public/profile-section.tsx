"use client";

import { IslamicPattern } from "@/components/fikris";
import { Users, Target, Eye, Heart } from "lucide-react";

export function ProfileSection() {
  return (
    <section id="profil" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <IslamicPattern variant="arabesque" opacity={0.02} />
      
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Profil <span className="text-emerald-600">Remaja Masjid</span> Sabilul Huda
          </h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Profile Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100 shadow-sm mb-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tentang Kami</h3>
                <p className="text-gray-600 leading-relaxed">
                  Remaja Masjid Sabilul Huda adalah wadah bagi generasi muda Islam untuk 
                  mengembangkan potensi diri, memperdalam ilmu agama, dan berkontribusi 
                  positif bagi masyarakat. Didirikan dengan semangat untuk mencetak 
                  generasi muslim yang berakhlak mulia, berwawasan luas, dan siap 
                  menjadi pemimpin masa depan.
                </p>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visi */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <Eye className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Visi</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Mencetak generasi muda Islam yang beriman, berilmu, dan beramal shaleh 
                serta mampu menjadi teladan dan penggerak kemajuan umat.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Misi</h3>
              </div>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Menyelenggarakan kajian rutin Al-Quran dan Hadits
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Mengembangkan potensi generasi muda melalui kegiatan positif
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Melakukan kegiatan sosial untuk membantu masyarakat
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">•</span>
                  Membangun ukhuwah Islamiyah antar pemuda muslim
                </li>
              </ul>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🕌", label: "Ta'at Beribadah" },
              { icon: "📚", label: "Semangat Belajar" },
              { icon: "🤝", label: "Ukhuwah Kuat" },
              { icon: "💫", label: "Akhlak Mulia" },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-100"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

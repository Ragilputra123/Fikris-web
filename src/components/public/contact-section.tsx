"use client";

import { IslamicPattern } from "@/components/fikris";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export function ContactSection() {
  return (
    <section id="kontak" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white relative overflow-hidden">
      <IslamicPattern variant="geometric" opacity={0.03} />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Hubungi <span className="text-emerald-600">Kami</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Punya pertanyaan atau ingin informasi lebih lanjut? 
            Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Location */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-sm text-gray-600">
                Masjid Sabilul Huda<br />
                Jl. Contoh No. 123<br />
                Kota, Indonesia
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
              <p className="text-sm text-gray-600">
                +62 812-3456-7890<br />
                (Senin - Sabtu)<br />
                08:00 - 17:00 WIB
              </p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-600">
                info@fikris.id<br />
                remaja@sabilulhuda.id
              </p>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center">
            <a
              href="https://wa.me/6281234567890?text=Assalamu'alaikum,%20saya%20ingin%20bertanya%20tentang%20Remaja%20Masjid%20Sabilul%20Huda"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-lg shadow-green-200 transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

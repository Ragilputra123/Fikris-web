"use client"

import Link from "next/link"
import { Logo } from "./logo"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin } from "lucide-react"

const quickLinks = [
  { href: "#beranda", label: "Beranda" },
  { href: "#tentang", label: "Tentang" },
  { href: "#kegiatan", label: "Kegiatan" },
  { href: "#hubungi", label: "Hubungi" },
]

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "Facebook" },
  { href: "#", label: "YouTube" },
]

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-emerald-50 to-white border-t border-emerald-100">
      {/* Islamic pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Column 1: Logo & Description */}
          <div className="space-y-4">
            <Logo size="md" showText={true} />
            <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
              Sistem manajemen remaja masjid yang modern dan terintegrasi. 
              Membantu pengelolaan kegiatan, keuangan, dan anggota dengan mudah.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-emerald-700">
              Tautan Cepat
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-gray-600 hover:text-emerald-600 transition-colors w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-emerald-700">
              Kontak
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  Jl. Masjid Al-Ikhlas No. 123, Jakarta Selatan
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  +62 21 1234 5678
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-600">
                  info@fikris.id
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Media Sosial
              </h4>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 bg-emerald-200" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            &copy; {currentYear} Fikris. Hak cipta dilindungi.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

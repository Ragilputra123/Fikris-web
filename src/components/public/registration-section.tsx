"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IslamicPattern } from "@/components/fikris";
import { UserPlus, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function RegistrationSection() {
  const [formData, setFormData] = useState({
    nama: "",
    tanggalLahir: "",
    jenisKelamin: "",
    alamat: "",
    noHp: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "Aktif",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal mendaftar");
      } else {
        setSuccess(true);
        setFormData({
          nama: "",
          tanggalLahir: "",
          jenisKelamin: "",
          alamat: "",
          noHp: "",
        });
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="pendaftaran" className="py-16 md:py-24 bg-white relative overflow-hidden">
        <IslamicPattern variant="stars" opacity={0.02} />
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <Card className="border-emerald-100 shadow-lg">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pendaftaran Berhasil!
                </h3>
                <p className="text-gray-600 mb-6">
                  Selamat! Anda telah terdaftar sebagai anggota Remaja Masjid 
                  Sabilul Huda. Silakan hubungi pengurus untuk informasi lebih lanjut.
                </p>
                <Button
                  onClick={() => setSuccess(false)}
                  variant="outline"
                  className="border-emerald-200 text-emerald-600"
                >
                  Daftar Anggota Lain
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pendaftaran" className="py-16 md:py-24 bg-white relative overflow-hidden">
      <IslamicPattern variant="stars" opacity={0.02} />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Daftar Jadi <span className="text-emerald-600">Anggota</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bergabunglah dengan Remaja Masjid Sabilul Huda dan jadilah bagian dari 
            generasi muda Islam yang aktif dan berprestasi.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <UserPlus className="h-5 w-5" />
                Form Pendaftaran Anggota
              </CardTitle>
              <CardDescription>
                Isi data diri Anda dengan lengkap untuk mendaftar sebagai anggota.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    name="nama"
                    placeholder="Masukkan nama lengkap"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
                    <Input
                      id="tanggalLahir"
                      name="tanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={handleChange}
                      required
                      className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
                    <Select
                      value={formData.jenisKelamin}
                      onValueChange={(value) =>
                        setFormData({ ...formData, jenisKelamin: value })
                      }
                    >
                      <SelectTrigger className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200">
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noHp">No. HP (WhatsApp) *</Label>
                  <Input
                    id="noHp"
                    name="noHp"
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={formData.noHp}
                    onChange={handleChange}
                    required
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat Lengkap *</Label>
                  <Textarea
                    id="alamat"
                    name="alamat"
                    placeholder="Masukkan alamat lengkap"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Daftar Sekarang
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Dengan mendaftar, Anda menyetujui untuk mengikuti peraturan 
                  dan ketentuan yang berlaku di Remaja Masjid Sabilul Huda.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

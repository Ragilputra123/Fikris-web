"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Share2,
  UserCheck,
} from "lucide-react";
import { Logo, IslamicPattern, PublicHeader, PublicFooter } from "@/components/fikris";

interface Event {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string | null;
  status: string;
  attendance: Array<{
    id: string;
    status: string;
    member: {
      id: string;
      nama: string;
      jenisKelamin: string;
    };
  }>;
  _count?: { attendance: number };
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError("Kegiatan tidak ditemukan");
      }
    } catch (err) {
      setError("Gagal memuat data kegiatan");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.nama,
          text: `Kegiatan: ${event?.nama} - ${formatDate(event?.tanggal || "")}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link berhasil disalin!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50/30">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </main>
        <PublicFooter />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50/30">
        <PublicHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-100">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDays className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Kegiatan Tidak Ditemukan
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "Kegiatan yang Anda cari tidak tersedia."}
              </p>
              <Link href="/">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <PublicFooter />
      </div>
    );
  }

  const presentCount = event.attendance.filter(
    (a) => a.status === "Hadir"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50/30">
      <PublicHeader />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/#kegiatan">
              <Button variant="ghost" className="text-gray-600 hover:text-emerald-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Daftar Kegiatan
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Event Header Card */}
            <Card className="border-emerald-100 overflow-hidden mb-6">
              {/* Header Background */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 mb-3">
                      {event.status}
                    </Badge>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      {event.nama}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-emerald-100">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.tanggal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.tanggal)} WIB</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Event Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Lokasi</p>
                        <p className="font-medium text-gray-900">{event.lokasi}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Users className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Peserta</p>
                        <p className="font-medium text-gray-900">
                          {presentCount} dari {event.attendance.length} hadir
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {event.deskripsi && (
                  <div className="border-t border-gray-100 pt-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Deskripsi Kegiatan
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {event.deskripsi}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Attendees Section */}
            {event.attendance.length > 0 && (
              <Card className="border-emerald-100">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    Daftar Peserta ({event.attendance.length})
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {event.attendance.map((attendee) => (
                      <div
                        key={attendee.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-700">
                            {attendee.member.nama.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {attendee.member.nama}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attendee.member.jenisKelamin}
                          </p>
                        </div>
                        <Badge
                          className={
                            attendee.status === "Hadir"
                              ? "bg-emerald-100 text-emerald-700"
                              : attendee.status === "Izin"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {attendee.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* CTA */}
            <div className="mt-6 text-center">
              <Link href="/#pendaftaran">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Daftar Jadi Anggota
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

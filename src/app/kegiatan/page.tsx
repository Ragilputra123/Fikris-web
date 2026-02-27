"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Logo, IslamicPattern, PublicHeader, PublicFooter } from "@/components/fikris";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Event {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string | null;
  status: string;
  _count?: { attendance: number };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        setEvents(await response.json());
      }
    } catch (error) {
      console.error("Error fetching events:", error);
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

  const getDaysUntil = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Sudah selesai";
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    if (diffDays <= 7) return `${diffDays} hari lagi`;
    return null;
  };

  const filteredEvents = events.filter(
    (event) => statusFilter === "all" || event.status === statusFilter
  );

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const month = new Date(event.tanggal).toLocaleDateString("id-ID", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-amber-50/30">
      <PublicHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Jadwal <span className="text-emerald-600">Kegiatan</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lihat semua kegiatan yang telah dan akan dilaksanakan oleh Remaja Masjid Sabilul Huda.
            </p>
          </div>

          {/* Filter */}
          <div className="max-w-md mx-auto mb-8">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                <SelectValue placeholder="Filter berdasarkan status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kegiatan</SelectItem>
                <SelectItem value="Akan Datang">Akan Datang</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : Object.keys(groupedEvents).length > 0 ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {Object.entries(groupedEvents).map(([month, monthEvents]) => (
                <div key={month}>
                  {/* Month Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {month}
                    </h2>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Events List */}
                  <div className="space-y-4">
                    {monthEvents.map((event) => {
                      const daysUntil = getDaysUntil(event.tanggal);
                      return (
                        <Card
                          key={event.id}
                          className="border-emerald-100 hover:shadow-lg transition-all overflow-hidden group"
                        >
                          <div className="flex flex-col md:flex-row">
                            {/* Date Badge */}
                            <div className="bg-gradient-to-b from-emerald-600 to-emerald-700 p-4 text-white flex flex-col items-center justify-center md:w-28">
                              <span className="text-2xl font-bold">
                                {new Date(event.tanggal).getDate()}
                              </span>
                              <span className="text-sm uppercase">
                                {new Date(event.tanggal).toLocaleDateString("id-ID", {
                                  month: "short",
                                })}
                              </span>
                            </div>

                            {/* Content */}
                            <CardContent className="flex-1 p-5">
                              <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                  {event.nama}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {daysUntil && (
                                    <Badge
                                      className={
                                        daysUntil === "Sudah selesai"
                                          ? "bg-gray-100 text-gray-600"
                                          : "bg-emerald-100 text-emerald-700"
                                      }
                                    >
                                      {daysUntil}
                                    </Badge>
                                  )}
                                  <Badge
                                    className={
                                      event.status === "Akan Datang"
                                        ? "bg-amber-100 text-amber-700"
                                        : "bg-emerald-100 text-emerald-700"
                                    }
                                  >
                                    {event.status === "Selesai" && (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    )}
                                    {event.status}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-emerald-500" />
                                  <span>{formatTime(event.tanggal)} WIB</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-emerald-500" />
                                  <span>{event.lokasi}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-emerald-500" />
                                  <span>{event._count?.attendance || 0} peserta</span>
                                </div>
                              </div>

                              {event.deskripsi && (
                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                  {event.deskripsi}
                                </p>
                              )}

                              <Link href={`/kegiatan/${event.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                >
                                  Lihat Detail
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </Link>
                            </CardContent>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-emerald-100 max-w-md mx-auto">
              <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak Ada Kegiatan
              </h3>
              <p className="text-gray-500">
                {statusFilter !== "all"
                  ? `Tidak ada kegiatan dengan status "${statusFilter}"`
                  : "Belum ada kegiatan terdaftar."}
              </p>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline" className="border-emerald-200 text-emerald-600">
                ← Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users, Clock, ArrowRight } from "lucide-react";

interface Event {
  id: string;
  nama: string;
  tanggal: string;
  lokasi: string;
  deskripsi: string | null;
  status: string;
  _count?: { attendance: number };
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events?status=Akan Datang");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.slice(0, 6)); // Show max 6 upcoming events
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
    
    if (diffDays === 0) return "Hari ini";
    if (diffDays === 1) return "Besok";
    if (diffDays > 1 && diffDays <= 7) return `${diffDays} hari lagi`;
    return null;
  };

  return (
    <section id="kegiatan" className="py-16 md:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Jadwal <span className="text-emerald-600">Kegiatan</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti berbagai kegiatan menarik yang telah kami siapkan untuk mengembangkan 
            potensi dan mempererat ukhuwah.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {events.map((event) => {
                const daysUntil = getDaysUntil(event.tanggal);
                return (
                  <Card
                    key={event.id}
                    className="border-emerald-100 hover:shadow-lg transition-all overflow-hidden group"
                  >
                    {/* Event Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-5 w-5" />
                          <span className="text-sm font-medium">
                            {formatDate(event.tanggal)}
                          </span>
                        </div>
                        {daysUntil && (
                          <Badge className="bg-white/20 text-white hover:bg-white/30">
                            {daysUntil}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                        {event.nama}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                          <span>{event._count?.attendance || 0} peserta terdaftar</span>
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
                          className="w-full border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          Lihat Detail
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Link href="/kegiatan">
                <Button
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  Lihat Semua Kegiatan
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-emerald-100 max-w-md mx-auto">
            <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Kegiatan
            </h3>
            <p className="text-gray-500">
              Kegiatan mendatang akan ditampilkan di sini.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

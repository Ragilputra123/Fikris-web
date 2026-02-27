"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/fikris/stats-card";
import {
  Users,
  CalendarDays,
  Wallet,
  TrendingUp,
  UserCheck,
  UserX,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IslamicPattern } from "@/components/fikris/islamic-pattern";

interface Stats {
  members: {
    total: number;
    active: number;
    inactive: number;
    male: number;
    female: number;
  };
  events: {
    total: number;
    upcoming: number;
    completed: number;
    recent: Array<{
      id: string;
      nama: string;
      tanggal: string;
      lokasi: string;
      status: string;
      _count: { attendance: number };
    }>;
  };
  finance: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    recent: Array<{
      id: string;
      tanggal: string;
      jenis: string;
      kategori: string;
      nominal: number;
    }>;
    monthlyData: Array<{
      month: string;
      income: number;
      expense: number;
    }>;
  };
  attendance: {
    total: number;
    present: number;
    excuse: number;
    absent: number;
    rate: number;
  };
}

export function DashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
        <IslamicPattern variant="geometric" opacity={0.1} />
        <div className="relative">
          <h1 className="text-2xl font-bold mb-2">
            Assalamu'alaikum, Admin! 👋
          </h1>
          <p className="text-emerald-100">
            Selamat datang di panel admin Fikris. Kelola remaja masjid dengan
            mudah dan efisien.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Anggota"
          value={stats?.members.total || 0}
          icon={Users}
          description={`${stats?.members.active || 0} anggota aktif`}
          trend={{ value: 12, isPositive: true }}
          variant="gradient"
        />
        <StatsCard
          title="Kegiatan Mendatang"
          value={stats?.events.upcoming || 0}
          icon={CalendarDays}
          description={`${stats?.events.total || 0} total kegiatan`}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Saldo Kas"
          value={formatCurrency(stats?.finance.balance || 0)}
          icon={Wallet}
          description="Dana tersedia"
          trend={{
            value: stats?.finance.balance && stats.finance.balance > 0 ? 8 : -5,
            isPositive: (stats?.finance.balance || 0) > 0,
          }}
        />
        <StatsCard
          title="Tingkat Kehadiran"
          value={`${stats?.attendance.rate || 0}%`}
          icon={TrendingUp}
          description="Rata-rata kehadiran"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Status Anggota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aktif</span>
                <Badge className="bg-emerald-100 text-emerald-700">
                  {stats?.members.active || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nonaktif</span>
                <Badge className="bg-gray-100 text-gray-700">
                  {stats?.members.inactive || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Laki-laki</span>
                <Badge className="bg-blue-100 text-blue-700">
                  {stats?.members.male || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Perempuan</span>
                <Badge className="bg-pink-100 text-pink-700">
                  {stats?.members.female || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Ringkasan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pemasukan</span>
                <span className="text-sm font-medium text-emerald-600">
                  {formatCurrency(stats?.finance.totalIncome || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pengeluaran</span>
                <span className="text-sm font-medium text-red-600">
                  {formatCurrency(stats?.finance.totalExpense || 0)}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Saldo</span>
                  <span
                    className={`text-lg font-bold ${
                      (stats?.finance.balance || 0) >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(stats?.finance.balance || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserX className="h-5 w-5 text-emerald-600" />
              Status Absensi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Hadir</span>
                <Badge className="bg-emerald-100 text-emerald-700">
                  {stats?.attendance.present || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Izin</span>
                <Badge className="bg-amber-100 text-amber-700">
                  {stats?.attendance.excuse || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tidak Hadir</span>
                <Badge className="bg-red-100 text-red-700">
                  {stats?.attendance.absent || 0}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Events */}
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">Kegiatan Terbaru</CardTitle>
            <CardDescription>5 kegiatan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.events.recent.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.nama}</TableCell>
                    <TableCell>{formatDate(event.tanggal)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          event.status === "Akan Datang"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(!stats?.events.recent || stats.events.recent.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      Belum ada kegiatan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Finance */}
        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
            <CardDescription>5 transaksi terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Nominal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats?.finance.recent.map((finance) => (
                  <TableRow key={finance.id}>
                    <TableCell className="font-medium">
                      {finance.kategori}
                    </TableCell>
                    <TableCell>{formatDate(finance.tanggal)}</TableCell>
                    <TableCell>
                      <span
                        className={
                          finance.jenis === "Pemasukan"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      >
                        {finance.jenis === "Pemasukan" ? "+" : "-"}
                        {formatCurrency(finance.nominal)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {(!stats?.finance.recent ||
                  stats.finance.recent.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                      Belum ada transaksi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

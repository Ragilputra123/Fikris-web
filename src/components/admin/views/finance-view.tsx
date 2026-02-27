"use client";

import { useEffect, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface FinanceRecord {
  id: string;
  tanggal: string;
  jenis: string;
  kategori: string;
  nominal: number;
  keterangan: string | null;
}

const incomeCategories = [
  "Kas Rutin",
  "Donasi",
  "Infaq",
  "Sedekah",
  "Sponsor",
  "Lainnya",
];

const expenseCategories = [
  "Konsumsi",
  "Transport",
  "Perlengkapan",
  "Dokumentasi",
  "Sosial",
  "Lainnya",
];

export function FinanceView() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [jenisFilter, setJenisFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);
  const [formData, setFormData] = useState({
    tanggal: "",
    jenis: "Pemasukan",
    kategori: "",
    nominal: "",
    keterangan: "",
  });

  // Summary stats
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    // Calculate summary
    const totalIncome = records
      .filter((r) => r.jenis === "Pemasukan")
      .reduce((sum, r) => sum + r.nominal, 0);
    const totalExpense = records
      .filter((r) => r.jenis === "Pengeluaran")
      .reduce((sum, r) => sum + r.nominal, 0);
    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  }, [records]);

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/finance");
      if (response.ok) {
        setRecords(await response.json());
      }
    } catch (error) {
      console.error("Error fetching finance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingRecord
        ? `/api/finance/${editingRecord.id}`
        : "/api/finance";
      const method = editingRecord ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          nominal: parseFloat(formData.nominal),
        }),
      });

      if (response.ok) {
        fetchRecords();
        closeDialog();
      } else {
        const error = await response.json();
        alert(error.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error saving finance:", error);
      alert("Gagal menyimpan data keuangan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    try {
      const response = await fetch(`/api/finance/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRecords();
      } else {
        const error = await response.json();
        alert(error.error || "Gagal menghapus transaksi");
      }
    } catch (error) {
      console.error("Error deleting finance:", error);
      alert("Gagal menghapus transaksi");
    }
  };

  const openEditDialog = (record: FinanceRecord) => {
    setEditingRecord(record);
    setFormData({
      tanggal: new Date(record.tanggal).toISOString().split("T")[0],
      jenis: record.jenis,
      kategori: record.kategori,
      nominal: record.nominal.toString(),
      keterangan: record.keterangan || "",
    });
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditingRecord(null);
    setFormData({
      tanggal: "",
      jenis: "Pemasukan",
      kategori: "",
      nominal: "",
      keterangan: "",
    });
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

  const filteredRecords = records.filter(
    (record) => jenisFilter === "all" || record.jenis === jenisFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Keuangan</h1>
          <p className="text-gray-600">Kelola pemasukan dan pengeluaran kas</p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pemasukan</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-100 bg-gradient-to-br from-red-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pengeluaran</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.totalExpense)}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`border-2 ${
            summary.balance >= 0
              ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white"
              : "border-red-200 bg-gradient-to-br from-red-50 to-white"
          }`}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo Kas</p>
                <p
                  className={`text-2xl font-bold ${
                    summary.balance >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(summary.balance)}
                </p>
              </div>
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  summary.balance >= 0 ? "bg-emerald-100" : "bg-red-100"
                }`}
              >
                <Wallet
                  className={`h-6 w-6 ${
                    summary.balance >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="border-emerald-100">
        <CardContent className="pt-6">
          <Select value={jenisFilter} onValueChange={setJenisFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="Pemasukan">Pemasukan</SelectItem>
              <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Riwayat Transaksi
          </CardTitle>
          <CardDescription>
            Total {filteredRecords.length} transaksi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Nominal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.tanggal)}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          record.jenis === "Pemasukan"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {record.jenis === "Pemasukan" ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        )}
                        {record.jenis}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.kategori}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {record.keterangan || "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span
                        className={
                          record.jenis === "Pemasukan"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }
                      >
                        {record.jenis === "Pemasukan" ? "+" : "-"}
                        {formatCurrency(record.nominal)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(record)}
                        >
                          <Pencil className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      {jenisFilter !== "all"
                        ? "Tidak ada transaksi yang sesuai filter"
                        : "Belum ada transaksi. Klik 'Tambah Transaksi' untuk menambahkan."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Edit Transaksi" : "Tambah Transaksi Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingRecord
                ? "Perbarui data transaksi keuangan"
                : "Isi data transaksi keuangan baru"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tanggal">Tanggal *</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) =>
                      setFormData({ ...formData, tanggal: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jenis">Jenis *</Label>
                  <Select
                    value={formData.jenis}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jenis: value, kategori: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pemasukan">Pemasukan</SelectItem>
                      <SelectItem value="Pengeluaran">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="kategori">Kategori *</Label>
                <Select
                  value={formData.kategori}
                  onValueChange={(value) =>
                    setFormData({ ...formData, kategori: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.jenis === "Pemasukan"
                      ? incomeCategories
                      : expenseCategories
                    ).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nominal">Nominal *</Label>
                <Input
                  id="nominal"
                  type="number"
                  value={formData.nominal}
                  onChange={(e) =>
                    setFormData({ ...formData, nominal: e.target.value })
                  }
                  required
                  min="0"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="keterangan">Keterangan</Label>
                <Textarea
                  id="keterangan"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({ ...formData, keterangan: e.target.value })
                  }
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Batal
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                {editingRecord ? "Perbarui" : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

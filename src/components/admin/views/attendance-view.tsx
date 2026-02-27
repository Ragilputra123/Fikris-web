"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ClipboardCheck, Check, X, AlertCircle } from "lucide-react";

interface Member {
  id: string;
  nama: string;
  jenisKelamin: string;
}

interface Event {
  id: string;
  nama: string;
  tanggal: string;
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  eventId: string;
  status: string;
  member: Member;
  event: Event;
}

export function AttendanceView() {
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchAttendance();
    }
  }, [selectedEvent]);

  const fetchData = async () => {
    try {
      const [eventsRes, membersRes] = await Promise.all([
        fetch("/api/events?status=Akan Datang"),
        fetch("/api/members?status=Aktif"),
      ]);

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
        if (eventsData.length > 0) {
          setSelectedEvent(eventsData[0].id);
        }
      }

      if (membersRes.ok) {
        setMembers(await membersRes.json());
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance?eventId=${selectedEvent}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data);

        // Initialize attendance data
        const initialData: Record<string, string> = {};
        members.forEach((member) => {
          const record = data.find(
            (a: AttendanceRecord) => a.memberId === member.id
          );
          initialData[member.id] = record?.status || "Hadir";
        });
        setAttendanceData(initialData);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  const handleOpenDialog = () => {
    const initialData: Record<string, string> = {};
    members.forEach((member) => {
      const record = attendance.find((a) => a.memberId === member.id);
      initialData[member.id] = record?.status || "Hadir";
    });
    setAttendanceData(initialData);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const promises = Object.entries(attendanceData).map(
        ([memberId, status]) =>
          fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              memberId,
              eventId: selectedEvent,
              status,
            }),
          })
      );

      await Promise.all(promises);
      fetchAttendance();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Gagal menyimpan absensi");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hadir":
        return (
          <Badge className="bg-emerald-100 text-emerald-700">
            <Check className="h-3 w-3 mr-1" />
            Hadir
          </Badge>
        );
      case "Izin":
        return (
          <Badge className="bg-amber-100 text-amber-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Izin
          </Badge>
        );
      case "Tidak Hadir":
        return (
          <Badge className="bg-red-100 text-red-700">
            <X className="h-3 w-3 mr-1" />
            Tidak Hadir
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Absensi</h1>
          <p className="text-gray-600">Kelola kehadiran anggota di setiap kegiatan</p>
        </div>
        <Button
          onClick={handleOpenDialog}
          disabled={!selectedEvent}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Input Absensi
        </Button>
      </div>

      {/* Event Selection */}
      <Card className="border-emerald-100">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Label>Pilih Kegiatan</Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Pilih kegiatan" />
                </SelectTrigger>
                <SelectContent>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.nama} - {formatDate(event.tanggal)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="border-emerald-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            Daftar Kehadiran
          </CardTitle>
          <CardDescription>
            {selectedEvent
              ? `${attendance.length} anggota tercatat`
              : "Pilih kegiatan untuk melihat daftar kehadiran"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedEvent ? (
            <div className="text-center text-gray-500 py-8">
              Pilih kegiatan terlebih dahulu untuk melihat daftar kehadiran
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis Kelamin</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member, index) => {
                    const record = attendance.find(
                      (a) => a.memberId === member.id
                    );
                    return (
                      <TableRow key={member.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {member.nama}
                        </TableCell>
                        <TableCell>{member.jenisKelamin}</TableCell>
                        <TableCell>
                          {record ? (
                            getStatusBadge(record.status)
                          ) : (
                            <Badge className="bg-gray-100 text-gray-500">
                              Belum Absen
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {members.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        Tidak ada anggota aktif
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Input Absensi</DialogTitle>
            <DialogDescription>
              Tandai kehadiran anggota untuk kegiatan ini
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{member.nama}</p>
                  <p className="text-xs text-gray-500">{member.jenisKelamin}</p>
                </div>
                <Select
                  value={attendanceData[member.id] || "Hadir"}
                  onValueChange={(value) =>
                    setAttendanceData({ ...attendanceData, [member.id]: value })
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hadir">Hadir</SelectItem>
                    <SelectItem value="Izin">Izin</SelectItem>
                    <SelectItem value="Tidak Hadir">Tidak Hadir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Simpan Absensi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

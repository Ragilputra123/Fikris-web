"use client";

import { useEffect, useState } from "react";
import { useNavigation } from "@/store/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { DashboardView } from "./views/dashboard-view";
import { MembersView } from "./views/members-view";
import { EventsView } from "./views/events-view";
import { AttendanceView } from "./views/attendance-view";
import { FinanceView } from "./views/finance-view";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Menu, Bell, Search, Calendar, Users, Wallet, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const viewTitles: Record<string, string> = {
  dashboard: "Dasbor",
  members: "Manajemen Anggota",
  events: "Manajemen Kegiatan",
  attendance: "Manajemen Absensi",
  finance: "Manajemen Keuangan",
};

interface Notification {
  id: string;
  type: "event" | "member" | "finance";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function AdminLayout() {
  const { currentView, sidebarOpen, setSidebarOpen } = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch stats to generate notifications
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        const notifs: Notification[] = [];

        // Generate notifications based on data
        if (data.events?.upcoming > 0) {
          notifs.push({
            id: "1",
            type: "event",
            title: "Kegiatan Mendatang",
            message: `Ada ${data.events.upcoming} kegiatan yang akan datang`,
            time: "Baru saja",
            read: false,
          });
        }

        if (data.members?.total > 0) {
          notifs.push({
            id: "2",
            type: "member",
            title: "Total Anggota",
            message: `${data.members.total} anggota terdaftar (${data.members.active} aktif)`,
            time: "1 jam lalu",
            read: false,
          });
        }

        if (data.finance?.balance !== undefined) {
          notifs.push({
            id: "3",
            type: "finance",
            title: "Saldo Kas",
            message: `Saldo kas saat ini: Rp ${data.finance.balance.toLocaleString("id-ID")}`,
            time: "2 jam lalu",
            read: data.finance.balance >= 0,
          });
        }

        if (data.attendance?.rate !== undefined) {
          notifs.push({
            id: "4",
            type: "event",
            title: "Tingkat Kehadiran",
            message: `Rata-rata kehadiran: ${data.attendance.rate}%`,
            time: "3 jam lalu",
            read: true,
          });
        }

        setNotifications(notifs);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-emerald-600" />;
      case "member":
        return <Users className="h-4 w-4 text-blue-600" />;
      case "finance":
        return <Wallet className="h-4 w-4 text-amber-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "members":
        return <MembersView />;
      case "events":
        return <EventsView />;
      case "attendance":
        return <AttendanceView />;
      case "finance":
        return <FinanceView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        <SidebarInset className="flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-emerald-100 bg-white/95 backdrop-blur px-4 md:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    className="text-emerald-600 cursor-pointer"
                    onClick={() => useNavigation.getState().setView("dashboard")}
                  >
                    Admin
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-700">
                    {viewTitles[currentView] || "Dasbor"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex-1" />

            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Cari..."
                  className="w-64 pl-8 bg-gray-50 border-gray-200 focus:border-emerald-500 focus:ring-emerald-200"
                />
              </div>
            </div>

            {/* Notification Button */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <div className="flex items-center justify-between p-4 border-b">
                  <h4 className="font-semibold text-gray-900">Notifikasi</h4>
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={markAllAsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700"
                    >
                      Tandai semua dibaca
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length > 0 ? (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                            !notification.read && "bg-emerald-50/50"
                          )}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-emerald-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-gray-500">
                      <Bell className="h-8 w-8 text-gray-300 mb-2" />
                      <p className="text-sm">Tidak ada notifikasi</p>
                    </div>
                  )}
                </ScrollArea>
                {notifications.length > 0 && (
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      onClick={() => {
                        fetchNotifications();
                      }}
                    >
                      Segarkan Notifikasi
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {renderView()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

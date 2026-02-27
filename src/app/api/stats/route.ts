import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/stats - Get dashboard statistics (optimized)
export async function GET() {
  try {
    // Run all independent queries in parallel
    const [
      memberStats,
      eventStats,
      allFinanceRecords,
      recentFinance,
      attendanceStats,
      recentEvents,
    ] = await Promise.all([
      // Member stats in one query
      db.member.groupBy({
        by: ['status', 'jenisKelamin'],
        _count: true,
      }),
      // Event stats
      db.event.groupBy({
        by: ['status'],
        _count: true,
      }),
      // All finance records for calculations
      db.finance.findMany({
        select: {
          tanggal: true,
          jenis: true,
          nominal: true,
        },
      }),
      // Recent finance records
      db.finance.findMany({
        take: 5,
        orderBy: { tanggal: 'desc' },
      }),
      // Attendance stats
      db.attendance.groupBy({
        by: ['status'],
        _count: true,
      }),
      // Recent events
      db.event.findMany({
        take: 5,
        orderBy: { tanggal: 'desc' },
        select: {
          id: true,
          nama: true,
          tanggal: true,
          lokasi: true,
          status: true,
          _count: {
            select: { attendance: true },
          },
        },
      }),
    ]);

    // Process member stats
    let totalMembers = 0;
    let activeMembers = 0;
    let inactiveMembers = 0;
    let maleMembers = 0;
    let femaleMembers = 0;

    memberStats.forEach((stat) => {
      totalMembers += stat._count;
      if (stat.status === 'Aktif') activeMembers += stat._count;
      if (stat.status === 'Nonaktif') inactiveMembers += stat._count;
      if (stat.jenisKelamin === 'Laki-laki') maleMembers += stat._count;
      if (stat.jenisKelamin === 'Perempuan') femaleMembers += stat._count;
    });

    // Process event stats
    let totalEvents = 0;
    let upcomingEvents = 0;
    let completedEvents = 0;

    eventStats.forEach((stat) => {
      totalEvents += stat._count;
      if (stat.status === 'Akan Datang') upcomingEvents = stat._count;
      if (stat.status === 'Selesai') completedEvents = stat._count;
    });

    // Process finance stats
    let totalIncome = 0;
    let totalExpense = 0;

    allFinanceRecords.forEach((record) => {
      if (record.jenis === 'Pemasukan') {
        totalIncome += record.nominal;
      } else {
        totalExpense += record.nominal;
      }
    });

    const balance = totalIncome - totalExpense;

    // Calculate monthly data in memory (single pass through records)
    const currentYear = new Date().getFullYear();
    const monthlyData: Array<{ month: string; income: number; expense: number }> = [];
    
    // Initialize all months
    for (let month = 0; month < 12; month++) {
      monthlyData.push({
        month: new Date(currentYear, month).toLocaleDateString('id-ID', { month: 'short' }),
        income: 0,
        expense: 0,
      });
    }

    // Single pass to aggregate monthly data
    allFinanceRecords.forEach((record) => {
      const recordDate = new Date(record.tanggal);
      if (recordDate.getFullYear() === currentYear) {
        const month = recordDate.getMonth();
        if (record.jenis === 'Pemasukan') {
          monthlyData[month].income += record.nominal;
        } else {
          monthlyData[month].expense += record.nominal;
        }
      }
    });

    // Process attendance stats
    let totalAttendance = 0;
    let presentCount = 0;
    let excuseCount = 0;
    let absentCount = 0;

    attendanceStats.forEach((stat) => {
      totalAttendance += stat._count;
      if (stat.status === 'Hadir') presentCount = stat._count;
      if (stat.status === 'Izin') excuseCount = stat._count;
      if (stat.status === 'Tidak Hadir') absentCount = stat._count;
    });

    const attendanceRate =
      totalAttendance > 0
        ? Math.round((presentCount / totalAttendance) * 100)
        : 0;

    return NextResponse.json({
      members: {
        total: totalMembers,
        active: activeMembers,
        inactive: inactiveMembers,
        male: maleMembers,
        female: femaleMembers,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        completed: completedEvents,
        recent: recentEvents,
      },
      finance: {
        totalIncome,
        totalExpense,
        balance,
        recent: recentFinance,
        monthlyData,
      },
      attendance: {
        total: totalAttendance,
        present: presentCount,
        excuse: excuseCount,
        absent: absentCount,
        rate: attendanceRate,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil statistik' },
      { status: 500 }
    );
  }
}

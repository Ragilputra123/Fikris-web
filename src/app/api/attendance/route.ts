import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/attendance - List attendance with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const memberId = searchParams.get('memberId');

    const attendance = await db.attendance.findMany({
      where: {
        ...(eventId && { eventId }),
        ...(memberId && { memberId }),
      },
      include: {
        member: {
          select: {
            id: true,
            nama: true,
            jenisKelamin: true,
          },
        },
        event: {
          select: {
            id: true,
            nama: true,
            tanggal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data absensi' },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Create or update attendance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { memberId, eventId, status } = body;

    if (!memberId || !eventId) {
      return NextResponse.json(
        { error: 'Member ID dan Event ID wajib diisi' },
        { status: 400 }
      );
    }

    if (status && !['Hadir', 'Izin', 'Tidak Hadir'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus Hadir, Izin, atau Tidak Hadir' },
        { status: 400 }
      );
    }

    // Check if member and event exist
    const [member, event] = await Promise.all([
      db.member.findUnique({ where: { id: memberId } }),
      db.event.findUnique({ where: { id: eventId } }),
    ]);

    if (!member) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    if (!event) {
      return NextResponse.json(
        { error: 'Kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    // Upsert attendance (create or update if exists)
    const attendance = await db.attendance.upsert({
      where: {
        memberId_eventId: {
          memberId,
          eventId,
        },
      },
      update: {
        status: status || 'Hadir',
      },
      create: {
        memberId,
        eventId,
        status: status || 'Hadir',
      },
      include: {
        member: true,
        event: true,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Error creating/updating attendance:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan data absensi' },
      { status: 500 }
    );
  }
}

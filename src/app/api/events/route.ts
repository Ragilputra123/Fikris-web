import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/events - List all events with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const events = await db.event.findMany({
      where: status ? { status } : undefined,
      orderBy: { tanggal: 'desc' },
      include: {
        _count: {
          select: { attendance: true },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kegiatan' },
      { status: 500 }
    );
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, tanggal, lokasi, deskripsi, status } = body;

    // Validate required fields
    if (!nama || !tanggal || !lokasi) {
      return NextResponse.json(
        { error: 'Nama, tanggal, dan lokasi wajib diisi' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['Akan Datang', 'Selesai'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus Akan Datang atau Selesai' },
        { status: 400 }
      );
    }

    const event = await db.event.create({
      data: {
        nama,
        tanggal: new Date(tanggal),
        lokasi,
        deskripsi,
        status: status || 'Akan Datang',
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan kegiatan' },
      { status: 500 }
    );
  }
}

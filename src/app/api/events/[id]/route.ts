import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/events/[id] - Get single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await db.event.findUnique({
      where: { id },
      include: {
        attendance: {
          include: {
            member: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { attendance: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data kegiatan' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, tanggal, lokasi, deskripsi, status } = body;

    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (status && !['Akan Datang', 'Selesai'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus Akan Datang atau Selesai' },
        { status: 400 }
      );
    }

    const event = await db.event.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(tanggal && { tanggal: new Date(tanggal) }),
        ...(lokasi && { lokasi }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data kegiatan' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingEvent = await db.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Kegiatan tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Kegiatan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus kegiatan' },
      { status: 500 }
    );
  }
}

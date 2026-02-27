import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/members/[id] - Get single member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await db.member.findUnique({
      where: { id },
      include: {
        attendance: {
          include: {
            event: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anggota' },
      { status: 500 }
    );
  }
}

// PUT /api/members/[id] - Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nama, jenisKelamin, tanggalLahir, alamat, noHp, status } = body;

    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validate jenisKelamin if provided
    if (jenisKelamin && !['Laki-laki', 'Perempuan'].includes(jenisKelamin)) {
      return NextResponse.json(
        { error: 'Jenis kelamin harus Laki-laki atau Perempuan' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['Aktif', 'Nonaktif'].includes(status)) {
      return NextResponse.json(
        { error: 'Status harus Aktif atau Nonaktif' },
        { status: 400 }
      );
    }

    const member = await db.member.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(jenisKelamin && { jenisKelamin }),
        ...(tanggalLahir && { tanggalLahir: new Date(tanggalLahir) }),
        ...(alamat && { alamat }),
        ...(noHp && { noHp }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data anggota' },
      { status: 500 }
    );
  }
}

// DELETE /api/members/[id] - Delete member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if member exists
    const existingMember = await db.member.findUnique({
      where: { id },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Anggota tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.member.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Anggota berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus anggota' },
      { status: 500 }
    );
  }
}

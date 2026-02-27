import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/members - List all members with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const members = await db.member.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { attendance: true },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data anggota' },
      { status: 500 }
    );
  }
}

// POST /api/members - Create new member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nama, jenisKelamin, tanggalLahir, alamat, noHp, status } = body;

    // Validate required fields
    if (!nama || !jenisKelamin || !tanggalLahir || !alamat || !noHp) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi' },
        { status: 400 }
      );
    }

    // Validate jenisKelamin
    if (!['Laki-laki', 'Perempuan'].includes(jenisKelamin)) {
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

    const member = await db.member.create({
      data: {
        nama,
        jenisKelamin,
        tanggalLahir: new Date(tanggalLahir),
        alamat,
        noHp,
        status: status || 'Aktif',
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan anggota' },
      { status: 500 }
    );
  }
}

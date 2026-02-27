import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/finance - List all finance records with optional filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get('jenis');
    const kategori = searchParams.get('kategori');

    const finance = await db.finance.findMany({
      where: {
        ...(jenis && { jenis }),
        ...(kategori && { kategori }),
      },
      orderBy: { tanggal: 'desc' },
    });

    return NextResponse.json(finance);
  } catch (error) {
    console.error('Error fetching finance:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data keuangan' },
      { status: 500 }
    );
  }
}

// POST /api/finance - Create new finance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tanggal, jenis, kategori, nominal, keterangan } = body;

    if (!tanggal || !jenis || !kategori || nominal === undefined) {
      return NextResponse.json(
        { error: 'Tanggal, jenis, kategori, dan nominal wajib diisi' },
        { status: 400 }
      );
    }

    if (!['Pemasukan', 'Pengeluaran'].includes(jenis)) {
      return NextResponse.json(
        { error: 'Jenis harus Pemasukan atau Pengeluaran' },
        { status: 400 }
      );
    }

    if (typeof nominal !== 'number' || nominal < 0) {
      return NextResponse.json(
        { error: 'Nominal harus berupa angka positif' },
        { status: 400 }
      );
    }

    const finance = await db.finance.create({
      data: {
        tanggal: new Date(tanggal),
        jenis,
        kategori,
        nominal,
        keterangan,
      },
    });

    return NextResponse.json(finance, { status: 201 });
  } catch (error) {
    console.error('Error creating finance:', error);
    return NextResponse.json(
      { error: 'Gagal menambahkan data keuangan' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/finance/[id] - Get single finance record
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const finance = await db.finance.findUnique({
      where: { id },
    });

    if (!finance) {
      return NextResponse.json(
        { error: 'Data keuangan tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(finance);
  } catch (error) {
    console.error('Error fetching finance:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data keuangan' },
      { status: 500 }
    );
  }
}

// PUT /api/finance/[id] - Update finance record
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { tanggal, jenis, kategori, nominal, keterangan } = body;

    const existingFinance = await db.finance.findUnique({
      where: { id },
    });

    if (!existingFinance) {
      return NextResponse.json(
        { error: 'Data keuangan tidak ditemukan' },
        { status: 404 }
      );
    }

    if (jenis && !['Pemasukan', 'Pengeluaran'].includes(jenis)) {
      return NextResponse.json(
        { error: 'Jenis harus Pemasukan atau Pengeluaran' },
        { status: 400 }
      );
    }

    if (nominal !== undefined && (typeof nominal !== 'number' || nominal < 0)) {
      return NextResponse.json(
        { error: 'Nominal harus berupa angka positif' },
        { status: 400 }
      );
    }

    const finance = await db.finance.update({
      where: { id },
      data: {
        ...(tanggal && { tanggal: new Date(tanggal) }),
        ...(jenis && { jenis }),
        ...(kategori && { kategori }),
        ...(nominal !== undefined && { nominal }),
        ...(keterangan !== undefined && { keterangan }),
      },
    });

    return NextResponse.json(finance);
  } catch (error) {
    console.error('Error updating finance:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui data keuangan' },
      { status: 500 }
    );
  }
}

// DELETE /api/finance/[id] - Delete finance record
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingFinance = await db.finance.findUnique({
      where: { id },
    });

    if (!existingFinance) {
      return NextResponse.json(
        { error: 'Data keuangan tidak ditemukan' },
        { status: 404 }
      );
    }

    await db.finance.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data keuangan berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting finance:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data keuangan' },
      { status: 500 }
    );
  }
}

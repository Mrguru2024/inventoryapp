import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { prisma } from '@/lib/prisma';
import { parse } from 'csv-parse';
import { z } from 'zod';

const TransponderSchema = z.object({
  make: z.string().min(1).transform(val => val.toUpperCase()),
  model: z.string().min(1).transform(val => val.toUpperCase()),
  yearStart: z.string().transform(val => parseInt(val) || 0),
  yearEnd: z.string().nullable().transform(val => (val ? parseInt(val) : null)),
  transponderType: z.string(),
  chipType: z.string(),
  frequency: z.string().nullable(),
  notes: z.string().nullable(),
  compatibleParts: z.string().nullable(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    const text = await file.text();
    const records: any[] = [];
    let successful = 0;
    let failed = 0;

    // Parse CSV
    await new Promise((resolve, reject) => {
      parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
        .on('data', (row) => records.push(row))
        .on('error', reject)
        .on('end', resolve);
    });

    // Process records
    for (const record of records) {
      try {
        const validData = TransponderSchema.parse(record);
        await prisma.transponderKey.create({ data: validData });
        successful++;
      } catch (error) {
        failed++;
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      successful,
      failed,
      total: records.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { message: 'Failed to process file' },
      { status: 500 }
    );
  }
} 
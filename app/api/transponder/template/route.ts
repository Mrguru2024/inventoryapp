import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

const template = [
  {
    make: 'TOYOTA',
    model: 'CAMRY',
    yearStart: '2018',
    yearEnd: '2022',
    transponderType: '8A',
    chipType: 'H',
    frequency: '433MHz',
    notes: 'Smart key system',
    compatibleParts: 'HYQ14FBA'
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const csvHeader = Object.keys(template[0]).join(',');
    const csvRows = template.map(obj => 
      Object.values(obj)
        .map(val => `"${String(val).replace(/"/g, '""')}"`)
        .join(',')
    );
    const csvContent = [csvHeader, ...csvRows].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=transponder-template.csv'
      }
    });
  } catch (error) {
    console.error('Template error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { importBMWTransponderData } from '@/app/services/scraperService';
import { authOptions } from '@/app/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'TECHNICIAN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await importBMWTransponderData();

    return NextResponse.json({ 
      message: 'BMW transponder data imported successfully' 
    });
  } catch (error) {
    console.error('Error importing transponder data:', error);
    return NextResponse.json(
      { error: 'Failed to import transponder data' },
      { status: 500 }
    );
  }
} 
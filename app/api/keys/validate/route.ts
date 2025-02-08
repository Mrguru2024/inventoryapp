import { NextResponse } from 'next/server';
import { keySchema } from '@/lib/validations/key';

export async function POST(req: Request) {
  try {
    const json = await req.json();
    
    try {
      keySchema.parse(json);
      return NextResponse.json({ valid: true });
    } catch (error) {
      return NextResponse.json({ valid: false, errors: error.errors });
    }
  } catch (error) {
    return new NextResponse('Error validating key data', { status: 500 });
  }
} 
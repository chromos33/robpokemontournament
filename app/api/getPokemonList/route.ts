import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  
  const Pokemon = await sql`SELECT * FROM Pokemon`;

  return NextResponse.json({ Pokemon }, { status: 500 });
  
}
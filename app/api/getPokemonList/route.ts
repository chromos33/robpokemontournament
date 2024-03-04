import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  
  const {rows,fields} = await sql`SELECT * FROM Pokemon`;

  let result = rows.map((e:any) => {
    return {name: e.name, image: e.bloburl,uploadedimage:null};
  });

  return NextResponse.json( result, { status: 200 });
  
}
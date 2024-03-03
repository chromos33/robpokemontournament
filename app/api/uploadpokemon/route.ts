import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const name = searchParams.get('name');
  if(filename != null && name != null && request.body != null){
      const blob = await put(filename, request.body, {
        access: 'public',
      });

      const pokemonname = name;
      const pokemonblob = blob.url;
      try{
        const result = await sql`INSERT INTO Pokemon (Name, BlobUrl) VALUES (${pokemonname}, ${pokemonblob})`;
      }catch(error) {
        return NextResponse.json({ error }, { status: 500 });
      }
     
      return NextResponse.json(blob);
  }
  return NextResponse.json({ }, { status: 500 });
  
}
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  var Pokemon = undefined;
  {
    let {rows,fields} = await sql`SELECT Name FROM Pokemon`;

    Pokemon = rows.map((e:any) => {
      return {name: e.name, image: e.bloburl,uploadedimage:null};
    });

  }
  var Participants = undefined;
  {
    const { rows,fields} = await sql`SELECT * FROM Participant`;
    Participants = rows.map((e:any) => {
      return {name: e.name, tier: e.tier, pokemon: e.pokemon};
    });
  }
  var result = {
    Pokemon: Pokemon,
    Participants: Participants
  };
  

  return NextResponse.json( result, { status: 200 });
  
}
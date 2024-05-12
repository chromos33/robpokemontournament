import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request): Promise<NextResponse> {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=9999');
  const data = await response.json();

  for (const item of data.results) {
    const pokemonResponse = await fetch(item.url);
    const pokemonData = await pokemonResponse.json();

    const id = String(pokemonData.id).padStart(3, '0');
    console.log(id);
    const name = pokemonData.name;
    const imageUrl = `https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/imagesHQ/${id}.png`;

    const imageExists = await fetch(imageUrl).then(res => res.ok);

    if (imageExists) {
      const query = await sql`
        INSERT INTO pokemon (id, name, bloburl)
        VALUES (${id}, ${name}, ${imageUrl})
        ON CONFLICT (id) DO UPDATE
        SET name = ${name}, bloburl = ${imageUrl}
      `;
    }
  }

  return NextResponse.json({}, { status: 200 });
}
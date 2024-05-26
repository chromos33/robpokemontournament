import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const name = searchParams.get('name');
  var id = searchParams.get('id');
  if(filename != null && name != null && request.body != null){
      const blob = await put(filename, request.body, {
        access: 'public',
      });
      //console.log(blob.url);
      const pokemonname = name;
      const pokemonblob = blob.url;
      //const pokemonblob = "";
      try{
        if(id == undefined || id == "undefined")
          {
            const result: { max_id: number }[] = (await sql`SELECT Count(*) AS max_id FROM Pokemon`).rows;
            id = (result[0].max_id + 10001).toString();
            console.log(id);
          }
            const {rows,fields} = await sql`SELECT * FROM Pokemon WHERE id = ${id};`;
            if(id != undefined && rows.length > 0)
            {
              console.log("update");
              const result = await sql`UPDATE Pokemon SET BlobUrl = ${pokemonblob} WHERE id = ${id};`;
            }
            else{
              console.log("insert");
              const result = await sql`INSERT INTO Pokemon (id,Name, BlobUrl) VALUES (${id},${pokemonname}, ${pokemonblob});`;
            }
        
        
      }catch(error) {
        return NextResponse.json({ error }, { status: 500 });
      }
     
      return NextResponse.json(blob);
  }
  return NextResponse.json({ }, { status: 500 });
  
}
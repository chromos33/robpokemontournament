import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();
  console.log(json);
  if(json != null){
    console.log(json);
      try{
        const {rows,fields} = await sql`SELECT * FROM Participant WHERE id = ${json.id};`;
        if(rows.length > 0)
        {
          console.log("Update Participant");
          const result = await sql`UPDATE Participant SET ID = ${json.id}, Name = ${json.name}, Tier = ${json.tier}, Pokemon = ${json.pokemon} WHERE id = ${json.id};`;
        }
        else{
          console.log(`INSERT INTO Participant (Name, Tier,Pokemon) VALUES (${json.name}, ${json.tier}, ${json.pokemon});`);
          const result = await sql`INSERT INTO Participant (Name, Tier,Pokemon) VALUES (${json.name}, ${json.tier}, ${json.pokemon});`;
        }
        
      }catch(error) {
        return NextResponse.json({error}, { status: 500 });
      }
     
      return NextResponse.json({}, { status: 200 });
  }
  return NextResponse.json({ }, { status: 500 });
  
}
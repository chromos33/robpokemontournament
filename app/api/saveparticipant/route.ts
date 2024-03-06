import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function POST(request: Request): Promise<NextResponse> {
  const json = await request.json();
  console.log(json);
  if(json != null){
      try{
        const {rows,fields} = await sql`SELECT * FROM Participant WHERE Name = ${json.name};`;
        if(rows.length > 0)
        {
          console.log("Update Participant");
          const result = await sql`UPDATE Participant WHERE Name = ${json.name} SET Name = ${json.name}, Tier = ${json.tier}, Pokemon = ${json.pokemon} ;`;
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
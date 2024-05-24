import { NextResponse } from 'next/server'
import { google } from "googleapis";
import { sql } from '@vercel/postgres';

async function queryPokemonTable(pokemonName: string) {
  const result = await sql`SELECT * FROM Pokemon WHERE Name ILIKE ${pokemonName}`;
  return result.rowCount > 0;
}

async function createParticipant(username: string, tier: string, pokemonName: string) {
  await sql`INSERT INTO Participant (Name, Tier, Pokemon) VALUES (${username}, ${tier}, ${pokemonName})`;
}


export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const spreadsheetId = searchParams.get('spreadsheetId'); // assuming the spreadsheet ID is passed as a query parameter
  console.log(spreadsheetId);
  if (spreadsheetId === undefined || spreadsheetId === null) {
    return NextResponse.json({}, { status: 400 });
  }
  try {
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    //'107MdtHiAzVtHBXAbZlsMl6JWx3p-rH0PArXpkrKirJQ'
    client.authorize(async function (err, tokens) {
      if (err) {
        return NextResponse.json({ error: "Authorize Failed" }, { status: 400 });
      }

      const gsapi = google.sheets({ version: 'v4', auth: client });

      //CUSTOMIZATION FROM HERE
      const opt = {
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A1:E100'
      };
      await sql`TRUNCATE TABLE Participant`;
      let data = await gsapi.spreadsheets.values.get(opt);
      data.data.values?.forEach(async (row) => {
        const [username, tierNumber, pokemonName, bits, bitsPokemonName] = row;
        if (username == "Username") {
          return;
        }
        // Skip if pokemonName doesn't exist
        if (!pokemonName) {

        } else {
          const pokemonExists = await queryPokemonTable(pokemonName);

          // If pokemon exists, create a new participant
          if (pokemonExists) {
            const tier = `Tier${tierNumber}`;
            await createParticipant(username, tier, pokemonName);
          }
          else {
            console.log(`Pokemon ${pokemonName} does not exist in the database`);
          }
        }
        if (!bitsPokemonName) {

        } else {
          const pokemonbitsExists = await queryPokemonTable(bitsPokemonName);

          // If pokemon exists, create a new participant
          if (pokemonbitsExists) {
            await createParticipant(username, 'Bits', bitsPokemonName);
          }
          else {
            console.log(`Pokemon ${bitsPokemonName} does not exist in the database`);
          }
        }
      });
      return NextResponse.json({}, { status: 200 });
    });
  } catch (e) {
    return NextResponse.json({}, { status: 400 });
  }
  return NextResponse.json({}, { status: 400 });
}
import { NextResponse } from 'next/server'
import { google } from "googleapis";
import { sql } from '@vercel/postgres';

async function queryPokemonTable(pokemonName: string) {
  const result = await sql`SELECT * FROM Pokemon WHERE Name ILIKE ${pokemonName}`;
  return result.rowCount > 0;
}

async function createParticipant(username: string, tier: string, pokemonName: string) {
  await sql`INSERT INTO Participant (Name, Tier, Pokemon) VALUES (${username}, ${tier}, ${pokemonName.toLowerCase()})`;
}


export async function POST(request: Request): Promise<NextResponse> {
  const formData = await request.formData();
  var Error = "";
  const spreadsheetId = formData.get('spreadsheetId'); // assuming the spreadsheet ID is passed as a query parameter
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
    await client.authorize(async function (err, tokens) {
      if (err) {
        return NextResponse.json({ error: "Authorize Failed" }, { status: 400 });
      }
    });
      let Output = "";

      const gsapi = google.sheets({ version: 'v4', auth: client });

      //CUSTOMIZATION FROM HERE
      const opt = {
        spreadsheetId: spreadsheetId,
        range: 'Sheet1!A1:E100'
      };
      await sql`TRUNCATE TABLE Participant`;
      let data = await gsapi.spreadsheets.values.get(opt);
      let Errors = await Promise.all(data.data.values?.map(async (row) => {
        let SubError = "";
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
            SubError += `${username} could not be created because pokemon ${pokemonName} does not exist in the database<br/>`;
            //console.log(`Pokemon with the ${pokemonName} does not exist in the database`);
          }
        }
        if (!bitsPokemonName) {

        } else {
          const pokemonbitsExists = await queryPokemonTable(bitsPokemonName);

          // If pokemon exists, create a new participant
          if (pokemonbitsExists) {
            await createParticipant(username+"_Bits", 'Bits', bitsPokemonName);
          }
          else {
            SubError += `${username+"_Bits"} could not be created because pokemon ${bitsPokemonName} does not exist in the database<br/>`;
            //console.log(`Pokemon ${bitsPokemonName} does not exist in the database`);
          }
        }
        return SubError;
      }));
      Errors.forEach((e) => {
        if(e != '' && e != undefined)
          {
            Error += e;
          }
      })
      Error += "<br/> Please correct typos or add the missing pokemon to the database yourself"
  } catch (e) {
    return NextResponse.json({}, { status: 400 });
  }
  if(Error != "")
  {
    return NextResponse.json({Error: Error}, { status: 200 });
  }
  return NextResponse.json({}, { status: 403 });
}
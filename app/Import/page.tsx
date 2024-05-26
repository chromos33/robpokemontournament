'use client';

import Image from "next/image";
import styles from "../page.module.css";
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, useEffect } from 'react';
import { revalidatePath } from 'next/cache';

import clsx from "clsx";
export default function Import() {
    
   const [Error, setError] = useState("");
   const handleForm = (data:FormData) => {
    console.log(data);
    fetch("/api/ImportFromGoogleSheet", {
      method: "POST",
      body: data,
    }).then((res) => res.json()).then((data) => {
      console.log(data);
      if(data.Error != "")
      {
        setError(data.Error);
      }
    });
  }
  console.log(Error);
  return (
    <main className={styles.main}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <p>
              Enter the Google Spreadsheet ID
              <br/>
              i.e. the bold/green part
              <br/>
              https://docs.google.com/spreadsheets/d/<strong>107MdtHiAzVtHBXAbZlsMl6JWx3p-rH0PArXpkrKirJQ</strong>/edit#gid=0
            </p>

          </div>
          <div className="col-12">
            <form action={handleForm}>
              <input type="text" name="spreadsheetId" />
              <button type="submit">Submit</button>
            </form>
          </div>
          {Error !== "" && <div className="col-12" dangerouslySetInnerHTML={{ __html: Error }} />}
        </div>
      </div>
      
      
    </main>
  );
}

'use client';

import Image from "next/image";
import styles from "../page.module.css";
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';
import { revalidatePath } from 'next/cache';
export default function Setup() {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputNameRef = useRef<HTMLInputElement>(null);
    const [blob, setBlob] = useState<PutBlobResult | null>(null);
  return (
    <main className={styles.main}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
 
          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }
 
          const file = inputFileRef.current.files[0];
          const name = inputNameRef.current?.value;
 
          const response = await fetch(
            `/api/uploadpokemon?filename=${file.name}&name=${name}`,
            {
              method: 'POST',
              body: file,
            },
          );
 
          const newBlob = (await response.json()) as PutBlobResult;
 
          setBlob(newBlob);
        }}
      >
        <input type="text" ref={inputNameRef} name="name" required />
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>
    </main>
  );
}

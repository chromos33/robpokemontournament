'use client';
import styles from "../page.module.css";
import { useState, useRef, useEffect } from 'react';

export default function SetupParticipant() {
  const [Participants,setParticipants] = useState<any>([]);
  const [PokemonData,setPokemonData] = useState<any>([]);
  useEffect(() => {
    fetch("/api/getParticipantBaseData").then((res) => res.json()).then((data) => {
      if(data != undefined)
      {
        setParticipants(data.Participants);
        setPokemonData(data.Pokemon);
        console.log(data);
      }
      
    });
  },[]);
  return (
    <main className={styles.main}>
      Participant
    </main>
  );
}

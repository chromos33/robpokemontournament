'use client';

import Image from "next/image";
import styles from "../page.module.css";
import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef, useEffect } from 'react';
import { revalidatePath } from 'next/cache';
import SelectBox from "../Components/SelectBox";
import { MyDropzone } from "../Components/MyDropzone/MyDropzone";

import clsx from "clsx";
import SuggestDropDown from "../Components/SuggestDropDown/SuggestDropDown";
export default function Setup() {
    
    const inputFileRef = useRef<HTMLInputElement>(null);
    const inputNameRef = useRef<HTMLInputElement>(null);
    const [currentPokemon,setCurrentPokemon] = useState("init");
    const [mode,setMode] = useState("create"); // select or new

    const [PokemonData,setPokemonData] = useState<any>([]);
    const [Participants,setParticipants] = useState<any>([]);
    const [currentParticipant,setCurrentParticipant] = useState("init");
    useEffect(() => {
      fetch("/api/getParticipantBaseData").then((res) => res.json()).then((data) => {
        if(data != undefined)
        {
          setPokemonData(data.Pokemon);
          setParticipants(data.Participants);
        }
      });
    },[]);
    /*
  const submitForm = async (event:any) => {
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
  };*/
  const getPreviewImage = () => {
    if(mode == "create")
    {
      return null;
    }
    let currentPokemon = getCurrentPokemon();
    if(currentPokemon != null)
    {
      return currentPokemon.image;
    }
    return null;
  };
  const getCurrentPokemon = () => {
    if(Participants == undefined)
    {
      return null;
    }
    return Participants.find((e:any) => e.name.toLowerCase() == currentPokemon.toLowerCase());
  };
  const getCurrentParticipant = () => {
    if(PokemonData == undefined)
    {
      return null;
    }
    return PokemonData.find((e:any) => e.name.toLowerCase() == currentPokemon.toLowerCase());
  };
  const getCurrentPokemonName = () => {
    let pokemon = getCurrentPokemon();
    if(pokemon != null)
    {
      return pokemon.name;
    }
    return "";
  }
  const savePokemon = async (event:any) => {
    event.preventDefault();
    let currentPokemon = getCurrentPokemon();
    console.log(currentPokemon);
    if(currentPokemon != null)
    {
      if(currentPokemon.uploadedimage != null)
      {
        console.log(currentPokemon.uploadedimage.file);
        
        const response = await fetch(
          `/api/uploadpokemon?filename=${currentPokemon.uploadedimage.name}&name=${currentPokemon.name}`,
          {
            method: 'POST',
            body: currentPokemon.uploadedimage.file,
          },
        );
    
        const newBlob = (await response.json()) as PutBlobResult;
        updatePokemon(currentPokemon,undefined,newBlob.url);
        
      }
    }
  };
  const updatePokemon = (currentname:string, name?:string, image?:string, uploadedimage?:any) => {
    let tmp = PokemonData;
    let index = tmp.findIndex((e:any) => e.name.toLowerCase() == currentPokemon.toLowerCase());
    if(index != -1)
    {
      if(name != null && name != undefined)
      {
        tmp[index].name = name;
      }
      
      
      if(image != null && image != undefined)
      {
        tmp[index].image = image;
      }
      if(uploadedimage != null && uploadedimage != undefined)
      {
        tmp[index].uploadedimage = uploadedimage;
      }
      setPokemonData(tmp.map((x:any) => x));

      if(name != null)
      {
        setCurrentPokemon(name);
      }
      
    }
  };
  return (
    <main className={styles.main}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-6">
                <h1>Pokemon</h1>
                <SelectBox NewString="New Pokemon" active={currentPokemon} onChange={(e:any) => {
                  if(e == "")
                  {
                    
                    setMode("create");
                    let tmp = PokemonData;
                    let number = "";
                    if(tmp != undefined)
                    {
                      number = tmp.length;
                    }

                    setCurrentPokemon("New Pokemon "+number);
                    
                    tmp.push({name:"New Pokemon "+number,image:null,uploadedimage:null});
                    
                    setPokemonData(tmp.map((x:any) => x));
                    
                  }
                  else
                  {
                    setMode("update");
                    setCurrentPokemon(e);
                  }
                  // Do Something like Fill out the form from the selected data unless it's new data then clear form
                }} data={PokemonData} />
                <span className="d-noe">{currentPokemon}</span>
              </div>
              <div className="col-12 col-md-6 py-5">
                  <div className={clsx({
                    ["d-none"]: currentPokemon == "init"
                  })}>
                    <label>Pokemon Name</label>
                    <input type="text" onChange={(x:any) => {updatePokemon(currentPokemon,x.target.value)}} value={getCurrentPokemonName()} ref={inputNameRef} name="name" required />
                    <label>Pokemon Image</label>
                    <MyDropzone key={currentPokemon} onUpload={(e:any) => {
                      //update current Pokemon                    
                      updatePokemon(currentPokemon,undefined,undefined,e);

                    }} previewImage={getPreviewImage()}/>
                    <button className="btn btn-primary" onClick={savePokemon} type="submit">Save</button>
                  </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="row">
              <div className="col-6">
                <h1>Participants</h1>
                <SelectBox NewString="New Participant" active={""} onChange={(e:any) => {}} data={Participants} />
              </div>
              <div className="col-6 mt-5">
                  <div className={clsx({
                        ["d-none"]: currentParticipant == "init" && false
                      })}>
                        <label>Participant Name</label>
                        <input name="name" required />
                        <label>Tier</label>
                        <select name="tier" required>
                          <option value="Tier1">Tier 1</option>
                          <option value="Tier2">Tier 2</option>
                          <option value="Tier3">Tier 3</option>
                          <option value="Bits">Bits</option>
                        </select>
                        <label>Pokemon (type to filter)</label>
                        <SuggestDropDown Label="Pokemon" Items={PokemonData} onSelect={(e:any) => {}} />


                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    </main>
  );
}

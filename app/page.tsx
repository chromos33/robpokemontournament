'use client';
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import clsx from "clsx";
import Healthbar from "./Components/Healthbar/HealthBar";

export default function Home() {
  const [Participants, setParticipants] = useState<any>([]);
  const [Pokemon, setPokemon] = useState<any>([]);
  const [Rolling, setRolling] = useState<any>(false);
  const PlayerStartHealth = 50;
  const [PlayerOne, setPlayerOne] = useState<any>(undefined);
  const [PlayerOneDamaged, setPlayerOneDamaged] = useState<any>(false);
  const [PlayerOneHealth, setPlayerOneHealth] = useState<any>(PlayerStartHealth);
  const [PlayerOneRoll, setPlayerOneRoll] = useState<any>(0);

  const [PlayerTwo, setPlayerTwo] = useState<any>(undefined);
  const [PlayerTwoHealth, setPlayerTwoHealth] = useState<any>(PlayerStartHealth);
  const [PlayerTwoRoll, setPlayerTwoRoll] = useState<any>(0);
  const [PlayerTwoDamaged, setPlayerTwoDamaged] = useState<any>(false);
  useEffect(() => {
    let participants = [
      {
        name: "Player 1",
        tier: "Bits",
        pokemon: "Glurak"
      },
      {
        name: "Player 2",
        tier: "Tier2",
        pokemon: "Glurak"
      },
      {
        name: "Player 3",
        tier: "Tier3",
        pokemon: "Pikachu"
      },
      {
        name: "Player 4",
        tier: "Tier3",
        pokemon: "Glurak"
      }
    ];
    setParticipants(participants);
    let pokemon = [
      {
        name: "Glurak",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10039.png"
      },
      {
        name: "Pikachu",
        image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10106.png"
      }
    ];
    setPokemon(pokemon);

  }, []);
  const getPokemonImage = (name:string) => {
    let pokemon = Pokemon.find((e:any) => e.name == name);
    if(pokemon != undefined) {
      return pokemon.image;
    }
    return "";
  }
  const renderParticipantOptions = () => {
    if(Participants.length > 0) {
      return Participants.map((e:any,index:number) => {
        return <option key={index} value={e.name}>{e.name} Tier {renderTier(e.tier)}</option>
      });
    }
  }
  const renderTier = (tier:string) => {
    switch(tier) {
      case "Bits": return "Bits";
      case "Tier1": return "1";
      case "Tier2": return "2";
      case "Tier3": return "3";
      default: return "";
    }
  }
  const getPlayerOne = () => {
    return Participants.find((e:any) => e.name == PlayerOne);
  }
  const getPlayerTwo = () => {
    return Participants.find((e:any) => e.name == PlayerTwo);
  }
  const RollOnce = (sides:number) : number => {
    return Math.floor(Math.random() * sides) + 1;
  }
  const RollDice = (Tier:string) : number => {
    let diceCount = 1;
    let diceSides = 6;
    switch(Tier) {
      case "Bits": diceSides = 4; diceCount = 1; break;
      case "Tier1": diceSides = 6; diceCount = 2; break;
      case "Tier2": diceSides = 8; diceCount = 3; break;
      case "Tier3": diceSides = 10; diceCount = 2; break;
    }
    let result = 0;
    for(let i = 0; i < diceCount; i++) {
      let roll = RollOnce(diceSides);
      result += roll;
    }
    return result;
  }

  const PlayersAreSet = () => {
    return getPlayerOne() != undefined && getPlayerTwo() != undefined;
  }

  const RollPlayerOne = () => {
    if(!Rolling && PlayersAreSet())
    {
      setRolling(true);
      let interval1 = setInterval(() => {
        setPlayerOneRoll(RollDice(getPlayerOne().tier));
      },200);
      setTimeout(() => {
        clearInterval(interval1);
        setTimeout(() => {
          let Roll = RollDice(getPlayerOne().tier);
          console.log(Roll);
          setPlayerOneRoll(Roll);
          DamagePlayerTwo(Roll);
          setRolling(false);
        },200);
      },1600);
    }
  }
  const DamagePlayerTwo = (damage:number) => {
    let newHP = PlayerTwoHealth - damage;
    if(newHP < 0) newHP = 0;
    setPlayerTwoHealth(newHP);
    setPlayerTwoDamaged(true);
    setTimeout(() => {
      setPlayerTwoDamaged(false);
    },260);
  }
  const RollPlayerTwo = () => {
    if(!Rolling && PlayersAreSet())
    {
      setRolling(true);
      let interval2 = setInterval(() => {
        setPlayerTwoRoll(RollDice(getPlayerTwo().tier));
      },200);
      setTimeout(() => {
        clearInterval(interval2);
        setTimeout(() => {
          let Roll = RollDice(getPlayerTwo().tier);
          setPlayerTwoRoll(Roll);
          DamagePlayerOne(Roll);
          setRolling(false);
        },200);
      },1600);
    }
  }
  const DamagePlayerOne = (damage:number) => {
    let newHP = PlayerOneHealth - damage;
    if(newHP < 0) newHP = 0;
    setPlayerOneHealth(newHP);
    setPlayerOneDamaged(true);
    setTimeout(() => {
      setPlayerOneDamaged(false);
    },260);
  }
  return (
    <main className={styles.main}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12">
            <div className={clsx({
              [styles.playerone]: true,
              [styles.player]: true,
            })}>
              <div className="row">
                <div className="col-6">
                <select onChange={(e) => {
                  setPlayerOne(e.target.value);
                  setPlayerOneHealth(PlayerStartHealth);
                }} name="playerone" id="playerone">
                  <option value="Select" selected disabled>Choose Player</option>
                {renderParticipantOptions()}
                </select>
                </div>
                <div className="col-6 text-end">
                  {PlayerOne != undefined && <span>Level {renderTier(getPlayerOne().tier)}</span>}
                </div>
                {PlayerOne != undefined && 
                <div className="col-12">
                  
                  <Healthbar MaxHealth={PlayerStartHealth} Health={PlayerOneHealth} />
                  <span className={styles.RollResult}>{PlayerOneRoll}</span>
                  <span className="btn btn-primary mt-5 w-100 font-black bold" onClick={() => {RollPlayerOne()}}>Attack</span>
                </div>
                }
              </div>
                
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12 text-center">
            {PlayerOne != undefined && 
              <Image className={clsx({
                [styles.DamageAnimation]: PlayerOneDamaged
              })} alt="Pokemon" width={250} height={250} src={getPokemonImage(getPlayerOne().pokemon)} />
            }
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 text-center">
            {PlayerTwo != undefined && 
              <Image className={clsx({
                [styles.DamageAnimation]: PlayerTwoDamaged
              })}  alt="Pokemon" width={250} height={250} src={getPokemonImage(getPlayerTwo().pokemon)} />
            }
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className={clsx({
              [styles.playerTwo]: true,
              [styles.player]: true,
            })}>
              <div className="row">
                <div className="col-6">
                <select onChange={(e) => {
                  setPlayerTwo(e.target.value);
                  setPlayerTwoHealth(PlayerStartHealth);
                }} name="playerTwo" id="playerTwo">
                  <option value="Select" selected disabled>Choose Player</option>
                {renderParticipantOptions()}
                </select>
                </div>
                <div className="col-6 text-end">
                  {PlayerTwo != undefined && <span>Level {renderTier(getPlayerTwo().tier)}</span>}
                </div>
                {PlayerTwo != undefined && 
                <div className="col-12">
                  
                  <Healthbar MaxHealth={PlayerStartHealth} Health={PlayerTwoHealth} />
                  <span className={styles.RollResult}>{PlayerTwoRoll}</span>
                  <span className="btn btn-primary mt-5 w-100 font-black bold" onClick={() => {RollPlayerTwo()}}>Attack</span>
                </div>
                }
              </div>
                
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

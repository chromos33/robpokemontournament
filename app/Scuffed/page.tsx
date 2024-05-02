'use client';
import Image from "next/image";
import styles from "../page.module.css";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import clsx from "clsx";
import Healthbar from "../Components/Healthbar/HealthBar";

export default function Home() {
  const [Rolling, setRolling] = useState<any>(false);
  const PlayerStartHealth = 50;
  const [PlayerOne, setPlayerOne] = useState<string>("");
  const [PlayerOneDamaged, setPlayerOneDamaged] = useState<any>(false);
  const [PlayerOneHealth, setPlayerOneHealth] = useState<any>(PlayerStartHealth);
  const [PlayerOneRoll, setPlayerOneRoll] = useState<any>(0);
  const [PlayerOneCrit, setPlayerOneCrit] = useState<any>(0);

  const [PlayerTwo, setPlayerTwo] = useState<string>("");
  const [PlayerTwoHealth, setPlayerTwoHealth] = useState<any>(PlayerStartHealth);
  const [PlayerTwoRoll, setPlayerTwoRoll] = useState<any>(0);
  const [PlayerTwoCrit, setPlayerTwoCrit] = useState<any>(0);
  const [PlayerTwoDamaged, setPlayerTwoDamaged] = useState<any>(false);



  
  
  const RollOnce = (sides:number) : number => {
    return Math.floor(Math.random() * sides) + 1;
  }
  const RollDice = () : number => {
    let diceCount = 1;
    let diceSides = 20;
    let result = 0;
    for(let i = 0; i < diceCount; i++) {
      let roll = RollOnce(diceSides);
      result += roll;
    }
    return result;
  }

  const RollPlayerOne = () => {
    if(!Rolling)
    {
      setPlayerOneCrit(0);
      setRolling(true);
      let interval1 = setInterval(() => {
        setPlayerOneRoll(RollDice());
      },200);
      setTimeout(() => {
        clearInterval(interval1);
        setTimeout(() => {
          let Roll = RollDice();
          setPlayerOneRoll(Roll);
          if(Roll == 20)
          {
            let Crit = RollOnce(6);
            setPlayerOneCrit(Crit);
            Roll += Crit;
          }
          DamagePlayerTwo(Roll);
          setRolling(false);
        },200);
      },400);
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
    if(!Rolling)
    {
      setPlayerTwoCrit(0);
      setRolling(true);
      let interval2 = setInterval(() => {
        setPlayerTwoRoll(RollDice());
      },200);
      setTimeout(() => {
        clearInterval(interval2);
        setTimeout(() => {
          let Roll = RollDice();
          setPlayerTwoRoll(Roll);
            if(Roll == 20)
            {
                let Crit = RollOnce(6);
                setPlayerTwoCrit(Crit);
                Roll += Crit;
            }
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
            <div className="col-12">
                <span className="btn btn-primary mt-5 mb-5 w-100 font-black bold" onClick={() => {
                    setPlayerOneHealth(PlayerStartHealth);
                    setPlayerOne("");
                    setPlayerTwoHealth(PlayerStartHealth);
                    setPlayerOne("");
                }}>Reset</span>
            </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12">
            <div className={clsx({
              [styles.playerone]: true,
              [styles.player]: true,
            })}>
              <div className="row">
                <div className="col-6">
                    <input placeholder="Player One" type="text" value={PlayerOne} onChange={(input:any) => {setPlayerOne(input.target.value)}}/>
                </div>
                <div className="col-12">
                  
                  <Healthbar MaxHealth={PlayerStartHealth} Health={PlayerOneHealth} />
                  <span className={styles.RollResult}>{PlayerOneRoll} {PlayerOneCrit > 0 && <span> + {PlayerOneCrit}</span> }</span>
                  <span className="btn btn-primary mt-5 w-100 font-black bold" onClick={() => {RollPlayerOne()}}>Attack</span>
                </div>
              </div>
                
            </div>
          </div>
          <div className="col-lg-4 col-md-6 col-12 text-center pt-5">
            {PlayerOne}
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 col-md-6 col-12 text-center pt-5">
            {PlayerTwo}
          </div>
          <div className="col-lg-4 col-md-6 col-12">
            <div className={clsx({
              [styles.playerTwo]: true,
              [styles.player]: true,
            })}>
              <div className="row">
                <div className="col-6">
                <input placeholder="Player Two" type="text" value={PlayerTwo} onChange={(input:any) => {setPlayerTwo(input.target.value)}}/>
                </div>
                <div className="col-6 text-end">
                </div>
                
                <div className="col-12">
                  
                  <Healthbar MaxHealth={PlayerStartHealth} Health={PlayerTwoHealth} />
                  <span className={styles.RollResult}>{PlayerTwoRoll} {PlayerTwoCrit > 0 && <span> + {PlayerTwoCrit}</span> }</span>
                  <span className="btn btn-primary mt-5 w-100 font-black bold" onClick={() => {RollPlayerTwo()}}>Attack</span>
                </div>
              </div>
                
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

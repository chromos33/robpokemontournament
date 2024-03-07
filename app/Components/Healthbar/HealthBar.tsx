
import clsx from "clsx";
import styles from "./healthBar.module.css";
import { useState, useRef, useEffect } from 'react';

export default function Healthbar(props: {Health: number, MaxHealth:number}) {
  
  let width = (props.Health / props.MaxHealth) * 100 + "%";
    let healthBarColorClass = "green";
    if(props.Health < 15) healthBarColorClass = "red";
    else if(props.Health < 30) healthBarColorClass = "yellow";
    return (
        <div className={styles.progressBar}>
            <div className={clsx({
              [healthBarColorClass]: true,
              [styles.filler]:true
            })} style={{width:width}}></div>
            <span className={styles.currentHP}>{props.Health}</span>
        </div>
    )
}

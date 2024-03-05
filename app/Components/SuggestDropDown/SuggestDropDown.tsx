
import clsx from "clsx";
import styles from "./suggestdropdown.module.css";
import { useState, useRef, useEffect } from 'react';

export default function SuggestDropDown(props: {Label:string;Items:any;onSelect:any;}) {
  const [filter,setFilter] = useState<string>("");
  const [open,setOpen] = useState<boolean>(true);
  const renderData = () => {
   if(props.Items == null || props.Items == undefined || props.Items.length == 0)
   {
       return null;
   }
   return props.Items.filter((x:any) => {return x.name.includes(filter);}).map((item:any,index:number) => {
         return (
              <span key={index} className={styles.suggestitem} onClick={(e) => {
                setFilter(item.name);
                setOpen(false);
                props.onSelect(item.name);
              }}>{item.name}</span>
         );
   });
  }
  return (
    <div className={styles.selectbox}>
        <input type="text" onBlur={(e) => {setOpen(false);}} onFocus={(e) => {setOpen(true);}} value={filter} onChange={(e:any) => {setFilter(e.target.value);}} className={styles.input} placeholder={props.Label} />
        <div className={clsx({
            [styles.suggestbox]:true,
            ["d-none"]: !open
        })}>
          {renderData()}
        </div>
    </div>
  );
}

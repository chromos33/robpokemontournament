
import clsx from "clsx";
import styles from "./participantdropdown.module.css";
import { useState, useRef, useEffect } from 'react';

export default function ParticipantDropDown(props: {Label:string;Items:any;onSelect:any;value?:string}) {
  const [filter,setFilter] = useState<string>(props.value != undefined ? props.value : "");
  const [open,setOpen] = useState<boolean>(false);
  const dropdown = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // only add the event listener when the dropdown is opened
    function handleClick(event:any) {
      if (dropdown.current && !dropdown.current.contains(event.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", handleClick);

  }, [open]);
  const renderData = () => {
   if(props.Items == null || props.Items == undefined || props.Items.length == 0)
   {
       return null;
   }
   return props.Items.filter((x:any) => {return x.name.includes(filter);}).map((item:any,index:number) => {
         return (
              <span key={props.Label + " " +item.name} className={styles.suggestitem} onClick={(e) => {
                setFilter(item.name);
                setOpen(false);
                props.onSelect(item.name);
              }}>{item.name} ({item.tier})</span>
         );
   });
  }
  return (
    <div ref={dropdown} className={styles.selectbox}>
        <input type="text" onClick={(e) => {setOpen(true);}} value={filter} onChange={(e:any) => {setFilter(e.target.value);}} className={styles.input} placeholder={props.Label} />
        <div className={clsx({
            [styles.suggestbox]:true,
            ["d-none"]: !open
        })}>
          {renderData()}
        </div>
    </div>
  );
}

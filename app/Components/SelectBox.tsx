
import clsx from "clsx";
import styles from "./selectbox.module.css";

export default function SelectBox(props: {NewString:string;onChange:any; data:any;active:string;}) {

  const renderData = () => {
    if(props.data == null || props.data == undefined || props.data.length == 0)
    {
        return null;
    }
    return props.data.map((item:any,index:number) => {
        return (
            <span key={index} className={clsx({
            [styles.selectbox_icon]:true,
            [styles.active]:props.active === item.name,
            })} onClick={() => props.onChange(item.name)}>{item.name}</span>
        );
    });
  }
  return (
    <div className={styles.selectbox}>
        <span className={clsx({
            [styles.selectbox_icon]:true,
            [styles.new]:true,
            [styles.active]:props.active === "icon",
        })}
        onClick={() => {
            props.onChange("");
        }}>
        {props.NewString}</span>
        {renderData()}
    </div>
  );
}

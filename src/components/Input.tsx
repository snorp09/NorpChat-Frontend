import { ChangeEventHandler, EventHandler, SyntheticEvent } from "react"

interface InputProps {
    onChange?: ChangeEventHandler<HTMLInputElement>,
    placeholder?: string,
    text?: string
}

const Input = (props: InputProps) => {
    return <input className="rounded-md border bg-slate-100 py-1 px-2 flex-1" placeholder={props.placeholder} value={props.text} onChange={props.onChange}/>
}

export default Input;

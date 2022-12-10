import { MouseEventHandler } from "react";

interface ButtonProps {
    children?: React.ReactNode
    onClick?: MouseEventHandler
    type?: "button" | "submit" | "reset"
}

const Button = (props: ButtonProps) => {

    return (
        <button className="py-1 px-2 bg-indigo-600 rounded-md
        hover:bg-indigo-400 transition text-white
        hover:text-slate-800"
        type={props.type}
        onClick={props.onClick}>{props.children}</button>
    )

}

export default Button;

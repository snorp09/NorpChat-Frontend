import { MouseEventHandler, useEffect } from "react";

interface MessageProps {
    username?: string;
    text: string;
    onAppear?: () => void;
    id: number
    onClick?: (id: number) => void;
}

interface CloseButtonProps {
    onClick?: (id: number) => void;
}

const CloseButton = (props: CloseButtonProps) => {
    return <h3>Placeholder!</h3>
}

const Message = (props: MessageProps) => {

    useEffect(() => {
        if(props.onAppear) {
            props.onAppear();
        }
        return () => {}
    },[])

    return (
        <p className="hover:bg-slate-200 transition rounded-md px-1" onClick={() => props.onClick?props.onClick(props.id):undefined}><strong>{props.username}: </strong>{props.text}</p>
    )
}

export default Message;

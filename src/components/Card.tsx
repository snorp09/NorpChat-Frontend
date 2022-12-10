interface CardProps {
    children?: React.ReactNode
}

const Card = (props: CardProps) => {
    return (
        <div className="flex rounded-xl shadow-md p-2 flex-col h-full flex-grow-0 gap-1">
            {props.children}
        </div>
    )
}

export default Card;
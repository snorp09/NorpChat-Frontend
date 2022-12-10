import React, { useEffect, useRef, useState } from 'react'
import {IoSend} from 'react-icons/io5'
import Button from './components/Button'
import Card from './components/Card'
import Input from './components/Input'
import Message from './components/Message'

interface UsernameModalProps {
  onSubmit: (username: string) => void;
}

const UsernameModal = (props: UsernameModalProps) => {

  const [username, setUsername] = useState("");

  return(
    <div className='absolute top-0 right-0 w-screen h-screen flex bg-neutral-400/70 items-center justify-center'>
      <div className='bg-white p-3 rounded-xl'>
        <h3 className='mb-2 border-b px-2'>Set Username</h3>
        <form className='flex flex-col gap-2' onSubmit={(e) => {e.preventDefault(); props.onSubmit(username)}}>
          <Input placeholder='Username...' onChange={(e) => {setUsername(e.target.value)}} />
          <div className='flex justify-center'>
            <Button>Okay</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface SocketTextMessage{
  type: 'msg',
  username: string,
  message_text: string
  id?: number
}

interface SocketDeleteMessage{
  type: 'delete',
  username: string,
  id: number
}

function App() {

  let ws = useRef<WebSocket | null>(null);
  let chatboxRef = useRef<HTMLDivElement | null>(null);
  const [msgText, setMsgText] = useState("");
  const [messages, setMessages] = useState<SocketTextMessage[]>([]);
  const [username, setUsername] = useState("");
  //Ah, Sweet! A hacky variable to force a rerender lies below!
  const [forceUpdateValue, setForceUpdate] = useState(false);

  useEffect(() => {
    console.log(import.meta.env.VITE_SOCKET_URL)
    ws.current = new WebSocket(import.meta.env.VITE_SOCKET_URL); //The address must be more configurable in the future.
    ws.current.onopen = () => {console.log("Connected.")};
    ws.current.onclose = () => {console.log("Disconnected.")}
    ws.current.onmessage = (e) => {
      const parsed_data = JSON.parse(e.data)
      if(parsed_data.type === "msg"){
        setMessages(prev => [...prev, parsed_data])
      } else if(parsed_data.type === "delete"){
        setMessages(prev => {
          prev.forEach((msg, index )=> {
            if(parsed_data.id === msg.id){
              prev[index].message_text = "Deleted Message"
            }
          })
          return [...prev]
        })
      }
    }
    return () => {
      ws.current!.close();
    }
  }, [])

  useEffect(() => {
    const usernameToBe = window.sessionStorage.getItem("username");
    if(usernameToBe) {
      setUsername(usernameToBe);
    }
  })

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!ws.current) return;

    const outgoingMessage: SocketTextMessage = {
      type: "msg",
      username: username,
      message_text: msgText
    }

    console.log(JSON.stringify(outgoingMessage))

    ws.current.send(JSON.stringify(outgoingMessage));
    setMsgText("");
  }

  const deleteHandler = async (id: number) => {
    if(!ws.current) return;

    const outgoing_delete: SocketDeleteMessage = {
      type: "delete",
      username: username,
      id: id
    }
    ws.current.send(JSON.stringify(outgoing_delete));
  }

  const usernameSubmitHandler = (username: string) => {
    setUsername(username);
  }

  return (
    <div className="App">
      {username === "" && <UsernameModal onSubmit={usernameSubmitHandler} />}
      <div className="flex flex-col w-full items-center justify-center h-screen">
        <div className='lg:w-1/2 xs:w-full h-2/4'>
          <Card>
            <form className='flex gap-1' onSubmit={formSubmitHandler}>
              <Input placeholder='Message...' text={msgText} onChange={(e) => {setMsgText(e.target.value);}}/>
              <Button><IoSend size={"1rem"}/></Button>
            </form>
            <div className='flex flex-col h-full overflow-y-auto' ref={chatboxRef}>
              {messages.map((msg, index, row) => <Message key={msg.id} id={msg.id!} username={msg.username} onClick={deleteHandler} text={msg.message_text} onAppear={index + 1 == row.length ? () => {chatboxRef.current!.scrollTop = chatboxRef.current!.scrollHeight}: undefined} />)}
            </div>
          </Card>
      </div>
    </div>
    </div>
  )
}

export default App

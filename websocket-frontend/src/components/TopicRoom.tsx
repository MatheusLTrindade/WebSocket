import io from "socket.io-client";
import { Dispatch, FormEvent, SetStateAction, useContext, useEffect, useState } from "react"
import { Topic } from "./Home"
import { User, UserContext } from "../App";
import MessageBox from "./MessageBox";

type TopicRoomProps = {
  topic: Topic
  setOpenTopic: Dispatch<SetStateAction<Topic | null>>
}

export type Message = {
  _id: string;
  content: string;
  author?: User;
  createAt: string;
}

const socket = io("ws://localhost:3000");

export default function TopicRoom({ topic, setOpenTopic }: TopicRoomProps) {

  const { user } = useContext(UserContext)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    loadMessages();
  }, [])

  useEffect(() => {
    socket.emit("join_room", { name: user?.name, topicId: topic._id });

    socket.on("new_message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage])
    })

    return () => {
      socket.emit("leave_room", { name: user?.name, topicId: topic._id });
      socket.off("new_message");
    }
  }, [socket])

  async function loadMessages() {
    const data = await fetch(`http://localhost:3000/topics/${topic._id}`).then(res => res.json());
    setMessages(data.messages);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const content = formData.get("message")!.toString();
    e.currentTarget.reset();

    socket.emit("send_message", { content, author: user, topicId: topic._id })
  }

  return (
    <main className="room">
      <header>
        <h2>{topic.title}</h2>
        <button onClick={() => setOpenTopic(null)}>Back</button>
      </header>

      <section className="messages">
        {messages.map(message => <MessageBox message={message} key={message._id} />)}
      </section>
      
      <form className="send-message-form inline-form" onSubmit={handleSubmit}>
        <input type="text" name="message" id="message" placeholder="Type your message..." required />
        <button>Send</button>
      </form>
    </main>
  )
}

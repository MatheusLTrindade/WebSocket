import { FormEvent, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import TopicsList from "./TopicsList";
import TopicRoom from "./TopicRoom";

export type Topic = {
  _id: string;
  title: string;
}

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [openTopic, setOpenTopic] = useState<Topic | null>(null);

  async function fetchTopics(){
    const data = await fetch("http://localhost:3000/topics", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }).then(res => res.json());

    setTopics(data)
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title')!.toString();
    e.currentTarget.reset();

    const data = await fetch("http://localhost:3000/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).then(res => res.json());

    setTopics([...topics, data]);
  }

  if (openTopic) return <TopicRoom topic={openTopic} setOpenTopic={setOpenTopic} />;

  return (
    <>
      <header>
        <h2>Welcome, {user!.name}! 👋</h2>
        <nav>
          <button onClick={logout}>Logout</button>
        </nav>
      </header>

      <h3 className="form-title">Create a topic to discuss your favorite subjects</h3>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input type="text" name="title" id="title" required />
        <button>To create</button>
      </form>

      <TopicsList topics={topics} setTopics={setTopics} setOpenTopic={setOpenTopic}/>
    </>
  );
}
import { Dispatch, SetStateAction } from "react";
import { Topic } from "./Home";

type TopicsListProps = {
  topics: Topic[];
  setTopics: Dispatch<SetStateAction<Topic[]>>;
  setOpenTopic: Dispatch<SetStateAction<Topic | null>>;
}

export default function TopicsList({ topics, setTopics, setOpenTopic }: TopicsListProps) {

  async function deleteTopic(id: string){
    await fetch(`http://localhost:3000/topics/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    setTopics(topics.filter(topic => topic._id !== id));
  }

  return (
    <main id="topics">
      {topics.length === 0 
        ?
          <h3>It looks like there's nothing here... 😕</h3>
        : topics.map(topic => (
          <div className="topic" key={topic._id}>
            <h2>{topic.title}</h2>
            <div>
              <button onClick={() => setOpenTopic(topic)}>Enter the room</button>
              <button onClick={() => deleteTopic(topic._id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </main>
  )
}

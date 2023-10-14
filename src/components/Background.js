import { useEffect, useState } from "react";

const Background = () => {
  const [message, setMessage] = useState(null);
  const [value, setValue] = useState(null);
  const [currentTitle, setCurrentTitle] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);

  const createNewChat = () => {
    setMessage(null);
    setValue(null);
    setCurrentTitle(null);
  };

  const getMessage = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    };
    try {
      const responce = await fetch(
        "https://chat-gpt-back.onrender.com/completions",
        options
      );
      const data = await responce.json();
      setMessage(data.choices[0].message);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats((prevState) => [
        ...prevState,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const uniqueTitles = [
    ...new Set(previousChats.map((prevChat) => prevChat.title)),
  ];

  const currentChats = previousChats.filter(
    (prevChat) => prevChat.title === currentTitle
  );

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue(null);
  };

  return (
    <section className="bg-slate-800 flex h-[100vh]">
      <div className="bg-slate-950 w-[244px] flex flex-col justify-between">
        <button
          onClick={createNewChat}
          className="bg-transparent border-2 border-white border-opacity-30 py-2 px-1 m-3 hover:bg-slate-700 rounded-md`"
        >
          + New Chat
        </button>
        <ul className="h-[100%] my-1 mx-3">
          {uniqueTitles?.map((uniqueTitle, i) => (
            <li
              onClick={() => handleClick(uniqueTitle)}
              key={Math.random() + i}
              className="py-1 cursor-pointer"
            >
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <p className="text-center border-t-2 border-white border-opacity-30 py-2 px-1 m-3">
          Made by Rudra
        </p>
      </div>
      <div className="w-[100%] flex flex-col justify-between text-center">
        {!currentTitle && <h1 className="text-3xl my-4">Rudra GPT</h1>}
        <ul className="text-right pr-9 h-[30rem] my-10 overflow-y-auto">
          {currentChats.map((prevChat, i) => (
            <li key={Math.random() + 1 + i}>{prevChat.content}</li>
          ))}
        </ul>
        <div className="flex flex-col mx-2">
          <form onSubmit={getMessage} className="w-full max-w-4xl mx-auto">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full h-[2rem] outline-none py-5 pr-10 px-3 bg-slate-700 rounded-md"
            />
            <button
              type="submit"
              className="float-right relative bottom-8 right-4 cursor-pointer text-lg hover:text-slate-400"
            >
              &#x2713;
            </button>
          </form>
          <p className="text-xs text-white text-opacity-40 p-2">
            This is a clone of populat CHAT GPT openai website. Created for
            practice
          </p>
        </div>
      </div>
    </section>
  );
};

export default Background;

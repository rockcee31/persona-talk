import React, { useState, useRef, useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import { AppContext } from '../appContext';
const ChatUi = () => {
  const {persona} = useContext(AppContext)
  const [messages, setmessages] = useState([
    { from: "bot", content: `Hi I'm ${persona.name}.` },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userMessage.trim().toLowerCase()) return;

    const newMessages = [...messages, { from: "user", content: userMessage }];
    setmessages(newMessages);
    setUserMessage("");
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:3000/chat", {
        persona,
        message: userMessage,
      });
      setmessages([...newMessages, { from: "bot", content: res.data.reply }]);
    } catch (error) {
      console.error(error);
      setmessages([
        ...newMessages,
        { from: "bot", content: "Sorry, something went wrong." },
      ])
    }finally{
        setLoading(false)
    }
  };

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
    {/* nav */}
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <a className="p-8 text-xl font-bold">PerSona Talk</a>
        </div>
        <div className="flex-none item-center ">
          <span>🌜</span>
          <input
            type="checkbox"
            defaultChecked
            className="toggle toggle-neutral mr-5"
          />
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
        </div>
      </div>
    
    

      {/* body */}
      <div className="min-h-screen w-full flex justify-center bg-gray-100">
      <div className="flex flex-col max-w-3xl w-full items-stretch px-4  ">
        {messages.map((e, index) => {
          if (e.from == "bot") {
            return (
              <div key={index} className="chat chat-start ">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">bot</div>
                <div className="chat-bubble">{e.content}</div>
              </div>
            );
          } else {
            return (
              <div key={index} className="chat chat-end">
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                    />
                  </div>
                </div>
                <div className="chat-header">You</div>
                <div className="chat-bubble">{e.content}</div>
              </div>
            );
          }
        })}
        {loading && <progress className="progress w-56"></progress>}
        <div ref={messagesEndRef}></div>
      </div>
      </div>

      {/* footer */}
      {/* footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex justify-center">
        <div className="w-full max-w-3xl flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="input input-bordered flex-1"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUi;

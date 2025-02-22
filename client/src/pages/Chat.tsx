import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { BsFillSendFill } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa"; // Import user icon
import { generateRoomId } from "../../lib/utils";

const BACKEND_URL = "wss://quichat.onrender.com";

const Chat = () => {
  const navigate = useNavigate();
  const inviteCodeRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [messages, setMessages] = useState<
    { senderId: string; message: string }[]
  >([]);
  const wsRef = useRef<WebSocket>();
  const [params, setParams] = useSearchParams();
  const [roomId, setRoomId] = useState<string>(
    params.get("roomid")?.toLowerCase() || ""
  );
  const [senderId, setSenderId] = useState<string>(generateRoomId()); // Unique senderId for the current user
  const inputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const [firstUserId, setFirstUserId] = useState<string>("");
  const [secondUserId, setSecondUserId] = useState<string>("");

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ws = new WebSocket(BACKEND_URL);

    ws.onmessage = (event) => {
      try {
        const parsedMessage = JSON.parse(event.data);
        if (parsedMessage.type === "system" && parsedMessage.yourUserId) {
          setSenderId(parsedMessage.yourUserId);
          // Set as first user if none exists yet
          if (!firstUserId) {
            setFirstUserId(parsedMessage.yourUserId);
          }
          return;
        }

        if (parsedMessage.type === "chat") {
          // Set as second user if it's a new sender
          if (parsedMessage.senderId !== firstUserId && !secondUserId) {
            setSecondUserId(parsedMessage.senderId);
          }
          setMessages((m) => [
            ...m,
            {
              senderId: parsedMessage.senderId,
              message: parsedMessage.message,
            },
          ]);
        }
      } catch (error) {
        console.error("Invalid JSON received:", event.data);
      }
    };

    wsRef.current = ws;

    if (!roomId) {
      setRoomId(generateRoomId());
    }

    setParams({ roomid: roomId });

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId,
          },
        })
      );
    };

    // Cleanup
    return () => {
      ws.close();
    };
  }, [roomId, setParams]);

  function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = inputRef.current?.value;

    if (message && wsRef.current) {
      wsRef.current.send(
        JSON.stringify({
          type: "chat",
          senderId: senderId, // Include senderId
          payload: {
            message: message,
          },
        })
      );
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const copyInviteCode = () => {
    if (inviteCodeRef.current) {
      navigator.clipboard
        .writeText(inviteCodeRef.current.textContent!)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
        });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <main className="flex flex-col h-full p-4 gap-4">
        {/* Header section - Fixed at top */}
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto font-bold sm:text-lg sm:flex-row flex-col gap-4">
          <button
            onClick={() => navigate("/")}
            className="flex gap-1 items-center text-red-500 hover:text-red-600"
          >
            <IoIosArrowBack className="inline" /> Exit Chat
          </button>
          <div className="flex gap-2 items-center">
            <div className="font-medium">Invite Code: </div>
            <div
              className="font-courier bg-neutral-800 text-white px-3 py-1 rounded-md border border-neutral-700 flex gap-4 justify-between items-center"
              ref={inviteCodeRef}
            >
              {roomId}
              {isCopied ? (
                <IoMdCheckmark className="text-green-400" />
              ) : (
                <MdContentCopy
                  className="cursor-pointer text-neutral-300 hover:text-white hover:scale-105 transition-all"
                  onClick={copyInviteCode}
                />
              )}
            </div>
          </div>
        </div>

        {/* Chat container - Reduced height and lighter background */}
        <section className="flex-1 bg-gray-500 w-full max-w-4xl mx-auto rounded-xl border dark:border-neutral-700 shadow-md flex flex-col min-h-0 max-h-[calc(100vh-10rem)]">
          <div className="overflow-y-auto flex-1 sm:px-12 px-6 py-4 flex flex-col no-scrollbar">
            {messages.length === 0 && (
              <div className="text-indigo-400 dark:text-indigo-300 text-sm sm:text-base font-semibold h-full flex items-center justify-center self-center">
                Start a conversation!
              </div>
            )}
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === senderId;
              return (
                <div
                  key={index}
                  ref={messageRef}
                  className={`w-full flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {!isCurrentUser && (
                      <FaUserCircle className="text-3xl text-blue-500" />
                    )}
                    <div
                      className={`mt-2 py-2 px-4 rounded-3xl break-words whitespace-pre-wrap max-w-[90%] text-sm sm:text-base ${
                        isCurrentUser
                          ? "bg-purple-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {message.message}
                    </div>
                    {isCurrentUser && (
                      <FaUserCircle className="text-3xl text-purple-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-none w-full py-3">
            <form
              onSubmit={onSubmitHandler}
              className="border flex items-center justify-between gap-3 bg-gray-800 dark:bg-gray-800 dark:border-neutral-600 w-5/6 mx-auto rounded-full px-4 py-1.5"
            >
              <input
                type="text"
                className="font-medium outline-none w-full bg-transparent"
                autoFocus
                ref={inputRef}
              />
              <button type="submit">
                <BsFillSendFill className="text-xl hover:scale-105 cursor-pointer" />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Chat;

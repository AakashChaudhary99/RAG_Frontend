import React, { useEffect, useRef, useState } from "react";

export default function ChatBox() {
    const [messages, setMessages] = useState([
        {
            id: Date.now().toString(),
            human: "",
            ai: "Hello! Please ask the questions relaetd to the uplaoded pdf file?",
            time: new Date().toISOString(),
        },
    ]);

    const [text, setText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);

    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            const el = scrollRef.current;
            el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        console.log('trimmed', trimmed)
        setError(null);
        setIsSending(true);

        const id = Date.now().toString();
        const newMsg = {
            id,
            human: trimmed,
            ai: "",
            time: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMsg]);
        setText("");
        inputRef.current?.focus();

        try {
            const res = await fetch("http://127.0.0.1:8000/ask-questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: trimmed }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => null);
                throw new Error(json?.error || "API error");
            }

            const json = await res.json();
            const reply = json.response

            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, ai: reply } : m))
            );
        } catch (e) {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === id ? { ...m, ai: `Error: ${e.message}` } : m
                )
            );
            setError(e.message);
        } finally {
            setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isSending) sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full max-h-screen bg-white rounded-xl shadow-xl overflow-hidden">

            <div className="px-4 py-3 bg-gray-100 border-b flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-full text-white flex items-center justify-center font-semibold">
                    AI
                </div>
                <div>
                    <div className="font-semibold text-gray-800">Assistant</div>
                    <div className="text-xs text-gray-500">Human ↔ AI Conversation</div>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50"
            >
                {messages.map((m) => (
                    <div key={m.id} className="flex flex-col gap-2">

                        {m.human ? (
                            <div className="self-end max-w-[85%]">
                                <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-2xl break-words">
                                    {m.human}
                                </div>
                                <div className="text-xs text-gray-400 text-right mt-1">
                                    {new Date(m.time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                        ) : null}

                        {m.ai ? (
                            <div className="self-start max-w-[85%]">
                                <div className="inline-block bg-white border px-4 py-2 rounded-2xl break-words">
                                    {m.ai}
                                </div>
                            </div>
                        ) : (
                            
                            isSending && <div className="self-start max-w-[85%]">
                                <div className="inline-block bg-white border px-4 py-2 rounded-2xl text-gray-400">
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="px-4 py-3 bg-white border-t">
                <div className="flex gap-3 items-end">
                    <textarea
                        ref={inputRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        placeholder="Type your message..."
                        className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 min-h-[44px] max-h-32 overflow-auto"
                    />

                    <button
                        onClick={sendMessage}
                        disabled={isSending || !text.trim()}
                        className={`px-5 py-2 rounded-lg text-white ${isSending || !text.trim()
                                ? "bg-indigo-300 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {isSending ? "..." : "Send"}
                    </button>
                </div>

                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
            </div>
        </div>
    );
}

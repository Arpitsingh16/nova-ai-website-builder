import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import {
    ArrowLeft,
    Bot,
    Code2,
    ExternalLink,
    Globe,
    MessageSquare,
    Monitor,
    Rocket,
    Send,
    Sparkles,
    X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";

const THINKING_STEPS = [
    "Understanding your request...",
    "Planning layout changes...",
    "Improving responsiveness...",
    "Applying animations...",
    "Finalizing update..."
];

const MotionDiv = motion.div;

function WebsiteEditor() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { userData } = useSelector((state) => state.user);

    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");

    const iframeRef = useRef(null);

    const [updateLoading, setUpdateLoading] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [showCode, setShowCode] = useState(false);
    const [showFullPreview, setShowFullPreview] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const handleUpdate = async () => {
        if (!prompt.trim() || updateLoading) {
            return;
        }

        setUpdateLoading(true);

        const text = prompt;

        setPrompt("");

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                role: "user",
                content: text
            }
        ]);

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/update/${id}`,
                {
                    prompt: text
                },
                {
                    withCredentials: true
                }
            );

            // Keep Redux credits synchronized with the backend.
            if (typeof result.data?.remainingCredits === "number") {
                dispatch(
                    setUserData({
                        ...userData,
                        credits: result.data.remainingCredits,
                    })
                );
            }

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: "ai",
                    content: result.data.message
                }
            ]);

            setCode(result.data.code);
        } catch (error) {
            console.log(error);

            setMessages((currentMessages) => [
                ...currentMessages,
                {
                    role: "ai",
                    content:
                        error.response?.data?.message ||
                        "Something went wrong while updating the website."
                }
            ]);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDeploy = async () => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${website._id}`,
                {
                    withCredentials: true
                }
            );

            window.open(result.data.url, "_blank");

            setWebsite((currentWebsite) => ({
                ...currentWebsite,
                deployed: true,
                deployUrl: result.data.url
            }));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!updateLoading) {
            return;
        }

        const interval = setInterval(() => {
            setThinkingIndex(
                (currentIndex) =>
                    (currentIndex + 1) % THINKING_STEPS.length
            );
        }, 1200);

        return () => clearInterval(interval);
    }, [updateLoading]);

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-by-id/${id}`,
                    {
                        withCredentials: true
                    }
                );

                setWebsite(result.data);
                setCode(result.data.latestCode);
                setMessages(result.data.conversation || []);
            } catch (error) {
                console.log(error);

                setError(
                    error.response?.data?.message ||
                    "Unable to load this website."
                );
            }
        };

        handleGetWebsite();
    }, [id]);

    useEffect(() => {
        if (!iframeRef.current || !code) {
            return;
        }

        const blob = new Blob([code], {
            type: "text/html"
        });

        const url = URL.createObjectURL(blob);

        iframeRef.current.src = url;

        return () => URL.revokeObjectURL(url);
    }, [code]);

    const navigateBack = () => {
        window.history.back();
    };

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#08090d] text-white px-6">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl border border-red-400/15 bg-red-400/[0.06] flex items-center justify-center text-red-400">
                        <X size={20} />
                    </div>

                    <h1 className="mt-5 text-lg font-medium">
                        Unable to open project
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500">
                        {error}
                    </p>

                    <button
                        onClick={navigateBack}
                        className="mt-6 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }

    if (!website) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#08090d] text-white">
                <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
                    <Sparkles
                        size={16}
                        className="text-violet-300 animate-pulse"
                    />
                </div>

                <p className="mt-4 text-sm text-zinc-600">
                    Opening workspace...
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex bg-[#08090d] text-white overflow-hidden">

            {/* DESKTOP AI PANEL */}

            <aside className="hidden lg:flex w-[350px] shrink-0 flex-col border-r border-white/[0.07] bg-[#0b0d12]">

                {/* PANEL HEADER */}

                <div className="h-[64px] shrink-0 px-4 border-b border-white/[0.07] flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={navigateBack}
                            className="w-8 h-8 shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.06] transition"
                        >
                            <ArrowLeft size={15} />
                        </button>

                        <div className="min-w-0">
                            <div className="text-[9px] uppercase tracking-[0.16em] text-zinc-600">
                                Project
                            </div>

                            <div className="mt-0.5 text-sm font-medium truncate">
                                {website.title}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI IDENTITY */}

                <div className="px-4 pt-5">
                    <div className="rounded-xl border border-violet-400/[0.12] bg-violet-400/[0.035] p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/15 flex items-center justify-center">
                                <Bot
                                    size={15}
                                    className="text-violet-300"
                                />
                            </div>

                            <div>
                                <div className="text-sm font-medium">
                                    NOVA Assistant
                                </div>

                                <div className="text-[10px] text-zinc-600 mt-0.5">
                                    Describe changes in plain language
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONVERSATION */}

                <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                    {messages.length === 0 && (
                        <div className="py-10 text-center">
                            <div className="mx-auto w-9 h-9 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center">
                                <MessageSquare
                                    size={15}
                                    className="text-zinc-600"
                                />
                            </div>

                            <p className="mt-4 text-xs text-zinc-600 leading-5">
                                Ask NOVA to change your website.
                            </p>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <Message
                            key={index}
                            message={message}
                        />
                    ))}

                    {updateLoading && (
                        <MotionDiv
                            initial={{
                                opacity: 0,
                                y: 5
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className="flex gap-3"
                        >
                            <div className="w-7 h-7 shrink-0 rounded-lg bg-violet-400/10 border border-violet-400/15 flex items-center justify-center">
                                <Sparkles
                                    size={13}
                                    className="text-violet-300 animate-pulse"
                                />
                            </div>

                            <div className="pt-1.5 text-xs text-zinc-500">
                                {THINKING_STEPS[thinkingIndex]}
                            </div>
                        </MotionDiv>
                    )}
                </div>

                {/* PROMPT BOX */}

                <div className="p-4 border-t border-white/[0.07]">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] overflow-hidden focus-within:border-violet-400/25 transition">
                        <textarea
                            value={prompt}
                            disabled={updateLoading}
                            onChange={(event) =>
                                setPrompt(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" &&
                                    !event.shiftKey
                                ) {
                                    event.preventDefault();
                                    handleUpdate();
                                }
                            }}
                            placeholder="Ask for a change..."
                            rows={3}
                            className="w-full px-4 py-3 bg-transparent border-0 outline-none resize-none text-xs leading-5 text-zinc-200 placeholder:text-zinc-700 focus:ring-0"
                        />

                        <div className="px-3 py-2 flex items-center justify-between border-t border-white/[0.06]">
                            <span className="text-[9px] text-zinc-700">
                                Enter to send · Shift + Enter for new line
                            </span>

                            <button
                                disabled={
                                    !prompt.trim() || updateLoading
                                }
                                onClick={handleUpdate}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                                    prompt.trim() && !updateLoading
                                        ? "bg-white text-black hover:bg-zinc-200"
                                        : "bg-white/[0.05] text-zinc-700 cursor-not-allowed"
                                }`}
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN WORKSPACE */}

            <div className="flex-1 min-w-0 flex flex-col">

                {/* TOOLBAR */}

                <div className="h-[64px] shrink-0 px-4 md:px-5 border-b border-white/[0.07] bg-[#0b0d12] flex items-center justify-between">

                    {/* LEFT */}

                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={navigateBack}
                            className="lg:hidden w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-500"
                        >
                            <ArrowLeft size={15} />
                        </button>

                        <div className="hidden md:flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center">
                                <Sparkles size={13} />
                            </div>

                            <span className="text-sm font-semibold">
                                NOVA
                            </span>
                        </div>

                        <div className="hidden md:block w-px h-5 bg-white/[0.07]" />

                        <div className="flex items-center gap-2 min-w-0">
                            <Globe
                                size={14}
                                className="text-zinc-600 shrink-0"
                            />

                            <span className="text-xs text-zinc-400 truncate max-w-[180px] md:max-w-[280px]">
                                {website.title}
                            </span>
                        </div>
                    </div>

                    {/* CENTER */}

                    <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 p-1 rounded-lg border border-white/[0.07] bg-white/[0.025]">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.07] text-xs text-zinc-200">
                            <Monitor size={13} />
                            Preview
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div className="flex items-center gap-1.5">

                        {!website.deployed && (
                            <button
                                onClick={handleDeploy}
                                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition"
                            >
                                <Rocket size={13} />

                                <span className="hidden sm:inline">
                                    Deploy
                                </span>
                            </button>
                        )}

                        <button
                            onClick={() => setShowChat(true)}
                            className="lg:hidden w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-400"
                        >
                            <MessageSquare size={15} />
                        </button>

                        <button
                            onClick={() => setShowCode(true)}
                            className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                            title="View code"
                        >
                            <Code2 size={15} />
                        </button>

                        <button
                            onClick={() => setShowFullPreview(true)}
                            className="w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition"
                            title="Full screen preview"
                        >
                            <ExternalLink size={15} />
                        </button>
                    </div>
                </div>

                {/* PREVIEW */}

                <div className="relative flex-1 bg-[#15171c] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-3 md:p-5">
                        <div className="w-full h-full rounded-lg overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-black/20 bg-white">
                            <iframe
                                ref={iframeRef}
                                sandbox="allow-scripts allow-same-origin allow-forms"
                                className="w-full h-full bg-white"
                                title="Website preview"
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full border border-black/10 bg-black/65 backdrop-blur-xl text-[9px] uppercase tracking-[0.12em] text-white/60 pointer-events-none">
                        Live preview
                    </div>
                </div>
            </div>

            {/* MOBILE CHAT */}

            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{
                            y: "100%"
                        }}
                        animate={{
                            y: 0
                        }}
                        exit={{
                            y: "100%"
                        }}
                        transition={{
                            type: "spring",
                            damping: 28,
                            stiffness: 280
                        }}
                        className="fixed inset-0 z-[9999] bg-[#0b0d12] flex flex-col lg:hidden"
                    >
                        <div className="h-[64px] shrink-0 px-4 border-b border-white/[0.07] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-violet-400/10 border border-violet-400/15 flex items-center justify-center">
                                    <Bot
                                        size={15}
                                        className="text-violet-300"
                                    />
                                </div>

                                <div>
                                    <div className="text-sm font-medium">
                                        NOVA Assistant
                                    </div>

                                    <div className="text-[10px] text-zinc-600">
                                        Edit your website with AI
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowChat(false)}
                                className="w-8 h-8 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                            {messages.map((message, index) => (
                                <Message
                                    key={index}
                                    message={message}
                                />
                            ))}

                            {updateLoading && (
                                <div className="flex gap-3">
                                    <div className="w-7 h-7 shrink-0 rounded-lg bg-violet-400/10 border border-violet-400/15 flex items-center justify-center">
                                        <Sparkles
                                            size={13}
                                            className="text-violet-300 animate-pulse"
                                        />
                                    </div>

                                    <div className="pt-1.5 text-xs text-zinc-500">
                                        {THINKING_STEPS[thinkingIndex]}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/[0.07]">
                            <div className="flex gap-2">
                                <input
                                    placeholder="Ask for a change..."
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.035] border border-white/[0.08] text-sm outline-none focus:border-violet-400/25"
                                    onChange={(event) =>
                                        setPrompt(event.target.value)
                                    }
                                    value={prompt}
                                    disabled={updateLoading}
                                    onKeyDown={(event) => {
                                        if (
                                            event.key === "Enter" &&
                                            !event.shiftKey
                                        ) {
                                            event.preventDefault();
                                            handleUpdate();
                                        }
                                    }}
                                />

                                <button
                                    className={`w-11 rounded-xl flex items-center justify-center ${
                                        prompt.trim() && !updateLoading
                                            ? "bg-white text-black"
                                            : "bg-white/[0.06] text-zinc-600"
                                    }`}
                                    disabled={
                                        !prompt.trim() || updateLoading
                                    }
                                    onClick={handleUpdate}
                                >
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CODE PANEL */}

            <AnimatePresence>
                {showCode && (
                    <motion.div
                        initial={{
                            x: "100%"
                        }}
                        animate={{
                            x: 0
                        }}
                        exit={{
                            x: "100%"
                        }}
                        transition={{
                            type: "spring",
                            damping: 28,
                            stiffness: 280
                        }}
                        className="fixed inset-y-0 right-0 w-full lg:w-[52%] z-[9999] bg-[#111318] border-l border-white/[0.08] flex flex-col shadow-[-30px_0_80px_rgba(0,0,0,0.35)]"
                    >
                        <div className="h-[58px] shrink-0 px-4 flex items-center justify-between border-b border-white/[0.07] bg-[#0d0f14]">
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-md bg-violet-400/10 border border-violet-400/15 flex items-center justify-center">
                                    <Code2
                                        size={14}
                                        className="text-violet-300"
                                    />
                                </div>

                                <div>
                                    <div className="text-sm font-medium">
                                        Source code
                                    </div>

                                    <div className="text-[9px] text-zinc-600 uppercase tracking-[0.12em]">
                                        HTML
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCode(false)}
                                className="w-8 h-8 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.05] transition"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 min-h-0">
                            <Editor
                                theme="vs-dark"
                                value={code}
                                language="html"
                                onChange={(value) =>
                                    setCode(value || "")
                                }
                                options={{
                                    minimap: {
                                        enabled: false
                                    },
                                    fontSize: 13,
                                    padding: {
                                        top: 16
                                    },
                                    smoothScrolling: true,
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on"
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FULL PREVIEW */}

            <AnimatePresence>
                {showFullPreview && (
                    <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        exit={{
                            opacity: 0
                        }}
                        className="fixed inset-0 z-[9999] bg-[#08090d]"
                    >
                        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                            <div className="px-3 py-2 rounded-lg border border-white/[0.08] bg-black/70 backdrop-blur-xl text-xs text-white/70 flex items-center gap-2">
                                <Monitor size={13} />
                                {website.title}
                            </div>
                        </div>

                        <iframe
                            className="w-full h-full bg-white"
                            srcDoc={code}
                            sandbox="allow-scripts allow-same-origin allow-forms"
                            title="Full website preview"
                        />

                        <button
                            onClick={() => setShowFullPreview(false)}
                            className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-white/10 bg-black/70 backdrop-blur-xl flex items-center justify-center text-white hover:bg-black transition"
                        >
                            <X size={17} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Message({ message }) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 6
            }}
            animate={{
                opacity: 1,
                y: 0
            }}
            className={`flex gap-3 ${
                isUser ? "flex-row-reverse" : ""
            }`}
        >
            <div
                className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${
                    isUser
                        ? "bg-white text-black"
                        : "bg-violet-400/10 border border-violet-400/15 text-violet-300"
                }`}
            >
                {isUser ? (
                    <span className="text-[10px] font-semibold">
                        YOU
                    </span>
                ) : (
                    <Sparkles size={13} />
                )}
            </div>

            <div
                className={`max-w-[82%] ${
                    isUser ? "text-right" : ""
                }`}
            >
                <div className="text-[9px] uppercase tracking-[0.1em] text-zinc-700 mb-1.5">
                    {isUser ? "You" : "NOVA"}
                </div>

                <div
                    className={`px-3.5 py-2.5 rounded-xl text-xs leading-5 ${
                        isUser
                            ? "bg-white text-black rounded-tr-sm"
                            : "bg-white/[0.035] border border-white/[0.07] text-zinc-400 rounded-tl-sm"
                    }`}
                >
                    {message.content}
                </div>
            </div>
        </motion.div>
    );
}

export default WebsiteEditor;
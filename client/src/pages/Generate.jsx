import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    Command,
    LoaderCircle,
    Sparkles,
    WandSparkles,
    Zap
} from "lucide-react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { serverUrl } from "../App"
import { setUserData } from "../redux/userSlice"

const PHASES = [
    "Understanding your idea",
    "Planning the experience",
    "Building the interface",
    "Adding interactions",
    "Running final checks",
]

const EXAMPLES = [
    "A modern portfolio for a creative developer",
    "A premium landing page for a SaaS startup",
    "An elegant website for a boutique hotel",
]

function Generate() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userData } = useSelector((state) => state.user)

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")

    const handleGenerateWebsite = async () => {
        if (!prompt.trim() || loading) {
            return
        }

        setError("")
        setProgress(0)
        setPhaseIndex(0)
        setLoading(true)

        try {
            const result = await axios.post(
                `${serverUrl}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            console.log(result)

            // Keep Redux credits synchronized with the backend.
            if (typeof result.data?.remainingCredits === "number") {
                dispatch(
                    setUserData({
                        ...userData,
                        credits: result.data.remainingCredits,
                    })
                )
            }

            setProgress(100)
            setLoading(false)

            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)

            setError(
                error.response?.data?.message ||
                "Something went wrong while generating your website."
            )

            console.log(error)
        }
    }

    useEffect(() => {
        if (!loading) {
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6

            value += increment

            if (value >= 93) {
                value = 93
            }

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    const handleExample = (example) => {
        if (!loading) {
            setPrompt(example)
            setError("")
        }
    }

    return (
        <div className="min-h-screen bg-[#08090d] text-white overflow-hidden">

            {/* BACKGROUND */}

            <div className="fixed inset-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px"
                    }}
                />

                <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[650px] h-[650px] rounded-full bg-violet-600/[0.08] blur-[160px]" />

                <div className="absolute bottom-[-300px] right-[-100px] w-[450px] h-[450px] rounded-full bg-indigo-500/[0.05] blur-[150px]" />
            </div>

            {/* HEADER */}

            <header className="relative z-50 border-b border-white/[0.07] bg-[#08090d]/75 backdrop-blur-2xl">
                <div className="max-w-6xl mx-auto h-[72px] px-5 md:px-8 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.025] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.07] transition"
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div className="w-px h-6 bg-white/[0.08]" />

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2.5"
                        >
                            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                                <Sparkles size={15} />
                            </div>

                            <div className="text-left">
                                <div className="text-sm font-semibold tracking-tight">
                                    NOVA
                                </div>

                                <div className="text-[9px] text-zinc-600 uppercase tracking-[0.16em]">
                                    AI Studio
                                </div>
                            </div>
                        </button>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">
                        <Command size={13} />

                        <span>
                            Generation workspace
                        </span>
                    </div>
                </div>
            </header>

            {/* MAIN */}

            <main className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-24">

                {/* TITLE */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] text-[11px] text-zinc-500 uppercase tracking-[0.12em]">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_9px_rgba(139,124,255,0.8)]" />

                        New project
                    </div>

                    <h1 className="mt-7 text-4xl md:text-6xl font-semibold tracking-[-0.055em] leading-[0.95]">
                        What do you want
                        <br />

                        <span className="bg-gradient-to-r from-white via-violet-200 to-violet-500 bg-clip-text text-transparent">
                            to build?
                        </span>
                    </h1>

                    <p className="max-w-xl mx-auto mt-6 text-sm md:text-base leading-7 text-zinc-500">
                        Describe your idea. NOVA will turn your prompt into
                        a responsive website you can edit and deploy.
                    </p>
                </motion.div>

                {/* PROMPT AREA */}

                <motion.section
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.45 }}
                    className="mt-12 max-w-4xl mx-auto"
                >
                    <div
                        className={`relative rounded-2xl border overflow-hidden transition-all ${
                            loading
                                ? "border-violet-400/20 bg-[#101018]"
                                : "border-white/[0.1] bg-[#0d0f14] focus-within:border-violet-400/30"
                        }`}
                    >

                        {/* TOP LABEL */}

                        <div className="h-12 px-5 flex items-center justify-between border-b border-white/[0.06]">
                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <WandSparkles
                                    size={14}
                                    className="text-violet-400"
                                />

                                Website brief
                            </div>

                            <div className="text-[10px] text-zinc-700 uppercase tracking-[0.12em]">
                                AI generation
                            </div>
                        </div>

                        {/* TEXTAREA */}

                        <textarea
                            onChange={(e) => {
                                setPrompt(e.target.value)
                                setError("")
                            }}
                            value={prompt}
                            disabled={loading}
                            placeholder="Describe your website, its purpose, style, sections, content, and anything else that matters..."
                            className="w-full h-60 md:h-64 p-6 bg-transparent border-0 rounded-none outline-none resize-none text-sm md:text-base leading-7 text-zinc-200 placeholder:text-zinc-700 focus:ring-0 disabled:opacity-60"
                        />

                        {/* BOTTOM BAR */}

                        <div className="px-4 md:px-5 py-3 border-t border-white/[0.06] flex items-center justify-between gap-4">

                            <div className="text-[11px] text-zinc-700">
                                {prompt.length > 0
                                    ? `${prompt.length} characters`
                                    : "Be as specific as you like"}
                            </div>

                            <button
                                onClick={handleGenerateWebsite}
                                disabled={!prompt.trim() || loading}
                                className={`
                                    group flex items-center gap-2
                                    px-4 md:px-5 py-2.5 rounded-lg
                                    text-sm font-semibold
                                    transition-all
                                    ${
                                        prompt.trim() && !loading
                                            ? "bg-white text-black hover:bg-zinc-200"
                                            : "bg-white/[0.06] text-zinc-600 cursor-not-allowed"
                                    }
                                `}
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />

                                        Building
                                    </>
                                ) : (
                                    <>
                                        Generate

                                        <ArrowUpRight
                                            size={15}
                                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* ERROR */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    height: 0,
                                    y: -5
                                }}
                                animate={{
                                    opacity: 1,
                                    height: "auto",
                                    y: 0
                                }}
                                exit={{
                                    opacity: 0,
                                    height: 0,
                                    y: -5
                                }}
                                className="mt-3 px-4 py-3 rounded-lg border border-red-500/15 bg-red-500/[0.04] text-sm text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* EXAMPLES */}

                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-5"
                        >
                            <div className="flex items-center gap-2 mb-3 text-[10px] uppercase tracking-[0.14em] text-zinc-700">
                                <span>
                                    Try an example
                                </span>

                                <div className="h-px flex-1 bg-white/[0.05]" />
                            </div>

                            <div className="grid md:grid-cols-3 gap-2">
                                {EXAMPLES.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExample(example)}
                                        className="group p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] text-left hover:bg-white/[0.04] hover:border-white/[0.1] transition"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="text-xs leading-5 text-zinc-500 group-hover:text-zinc-300 transition">
                                                {example}
                                            </span>

                                            <ArrowUpRight
                                                size={13}
                                                className="shrink-0 mt-0.5 text-zinc-700 group-hover:text-violet-400 transition"
                                            />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.section>

                {/* GENERATION STATUS */}

                <AnimatePresence>
                    {loading && (
                        <motion.section
                            initial={{
                                opacity: 0,
                                y: 20
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            exit={{
                                opacity: 0,
                                y: 10
                            }}
                            className="max-w-3xl mx-auto mt-12"
                        >
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">

                                {/* STATUS HEADER */}

                                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="relative w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-400/15 flex items-center justify-center">
                                            <LoaderCircle
                                                size={15}
                                                className="text-violet-300 animate-spin"
                                            />
                                        </div>

                                        <div>
                                            <div className="text-sm font-medium">
                                                Creating your website
                                            </div>

                                            <div className="text-[11px] text-zinc-600 mt-0.5">
                                                This may take a few minutes
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-sm font-mono text-zinc-400">
                                        {progress}%
                                    </div>
                                </div>

                                {/* PROGRESS */}

                                <div className="p-5">

                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs text-zinc-400">
                                            {PHASES[phaseIndex]}
                                        </span>

                                        <span className="text-[10px] text-zinc-700">
                                            PROCESSING
                                        </span>
                                    </div>

                                    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-300"
                                            animate={{
                                                width: `${progress}%`
                                            }}
                                            transition={{
                                                ease: "easeOut",
                                                duration: 0.8
                                            }}
                                        />
                                    </div>

                                    {/* STEPS */}

                                    <div className="grid grid-cols-5 gap-2 mt-6">
                                        {PHASES.map((phase, index) => {
                                            const completed = index < phaseIndex
                                            const current = index === phaseIndex

                                            return (
                                                <div
                                                    key={phase}
                                                    className="flex flex-col gap-2"
                                                >
                                                    <div
                                                        className={`h-1 rounded-full transition-all ${
                                                            completed
                                                                ? "bg-violet-400"
                                                                : current
                                                                    ? "bg-violet-400/50"
                                                                    : "bg-white/[0.06]"
                                                        }`}
                                                    />

                                                    <span
                                                        className={`hidden md:block text-[9px] leading-3 ${
                                                            current
                                                                ? "text-zinc-300"
                                                                : completed
                                                                    ? "text-zinc-500"
                                                                    : "text-zinc-700"
                                                        }`}
                                                    >
                                                        {phase}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">

                                        <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                                            <Zap size={12} />

                                            NOVA is working through your brief
                                        </div>

                                        <div className="text-[11px] text-zinc-600">
                                            Please keep this tab open
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* FOOT NOTE */}

                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="mt-14 flex items-center justify-center gap-2 text-[11px] text-zinc-700"
                    >
                        <Check size={13} />

                        Your generated site will be fully editable
                    </motion.div>
                )}
            </main>

            {/* FOOTER */}

            <footer className="relative z-10 border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-5 md:px-8 py-6 flex items-center justify-between">

                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center">
                            <Sparkles size={12} />
                        </div>

                        <span className="text-xs font-medium">
                            NOVA
                        </span>
                    </div>

                    <span className="text-[10px] text-zinc-700">
                        AI website generation
                    </span>
                </div>
            </footer>
        </div>
    )
}

export default Generate
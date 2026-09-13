import {
    ArrowLeft,
    ArrowUpRight,
    Check,
    ExternalLink,
    FolderOpen,
    Plus,
    Rocket,
    Share2,
    Sparkles,
    Globe,
    Layers3,
    X,
    Coins,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

function Dashboard() {
    const { userData } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [websites, setWebsites] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copiedId, setCopiedId] = useState(null);

    const handleDeploy = async (id) => {
        try {
            const result = await axios.get(
                `${serverUrl}/api/website/deploy/${id}`,
                { withCredentials: true }
            );

            window.open(result.data.url, "_blank");

            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? {
                              ...w,
                              deployed: true,
                              deployUrl: result.data.url,
                          }
                        : w
                )
            );
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true);
            setError("");

            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    { withCredentials: true }
                );

                setWebsites(result.data || []);
                setLoading(false);
            } catch (error) {
                console.log(error);

                setError(
                    error.response?.data?.message ||
                        "Unable to load your websites."
                );

                setLoading(false);
            }
        };

        handleGetAllWebsites();
    }, []);

    const handleCopy = async (site) => {
        try {
            await navigator.clipboard.writeText(site.deployUrl);

            setCopiedId(site._id);

            setTimeout(() => {
                setCopiedId(null);
            }, 2000);
        } catch (error) {
            console.log(error);
        }
    };

    const deployedCount =
        websites?.filter((w) => w.deployed).length || 0;

    return (
        <div className="min-h-screen bg-[#08090d] text-white overflow-x-hidden">

            {/* BACKGROUND */}

            <div className="fixed inset-0 pointer-events-none">

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="absolute top-[-250px] right-[10%] w-[500px] h-[500px] rounded-full bg-violet-600/[0.07] blur-[150px]" />

                <div className="absolute bottom-[-250px] left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[150px]" />

            </div>

            {/* TOP BAR */}

            <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#08090d]/80 backdrop-blur-2xl">

                <div className="max-w-7xl mx-auto h-[72px] px-5 md:px-8 flex items-center justify-between">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.025] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.07] transition"
                        >
                            <ArrowLeft size={17} />
                        </button>

                        <div className="hidden sm:block w-px h-6 bg-white/[0.08]" />

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2.5"
                        >

                            <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center">
                                <Sparkles size={15} />
                            </div>

                            <div className="text-left">

                                <div className="font-semibold text-sm tracking-tight">
                                    NOVA
                                </div>

                                <div className="text-[9px] text-zinc-600 uppercase tracking-[0.16em]">
                                    AI Studio
                                </div>

                            </div>

                        </button>

                    </div>

                    <div className="flex items-center gap-3">

                        {/* CREDITS */}

                        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-lg border border-violet-400/[0.14] bg-violet-400/[0.05]">

                            <div className="w-6 h-6 rounded-md bg-violet-400/[0.12] flex items-center justify-center">
                                <Coins
                                    size={13}
                                    className="text-violet-300"
                                />
                            </div>

                            <div className="leading-none">

                                <div className="text-[9px] text-zinc-500 uppercase tracking-[0.12em]">
                                    Credits
                                </div>

                                <div className="mt-1 text-sm font-semibold text-white">
                                    {userData?.credits ?? 0}
                                </div>

                            </div>

                        </div>

                        <button
                            onClick={() => navigate("/generate")}
                            className="group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                        >

                            <Plus size={15} />

                            <span className="hidden sm:inline">
                                New project
                            </span>

                            <span className="sm:hidden">
                                New
                            </span>

                        </button>

                    </div>

                </div>

            </header>

            {/* CONTENT */}

            <main className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">

                {/* PAGE HEADER */}

                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-10"
                >

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">

                        <div>

                            <div className="flex items-center gap-2 text-xs text-violet-400 uppercase tracking-[0.16em] font-medium mb-3">
                                <Layers3 size={13} />
                                Workspace
                            </div>

                            <h1 className="text-3xl md:text-4xl font-semibold tracking-[-0.04em]">
                                Your projects
                            </h1>

                            <p className="mt-2 text-sm text-zinc-500">
                                Welcome back, {userData?.name}.
                                Everything you've created lives here.
                            </p>

                        </div>

                        <button
                            onClick={() => navigate("/generate")}
                            className="group self-start lg:self-auto flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.09] bg-white/[0.035] text-sm text-zinc-300 hover:text-white hover:bg-white/[0.07] transition"
                        >

                            Create something new

                            <ArrowUpRight
                                size={15}
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />

                        </button>

                    </div>

                </motion.section>

                {/* STATS */}

                <motion.section
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.4 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-white/[0.07] rounded-2xl overflow-hidden mb-12 bg-white/[0.015]"
                >

                    {/* PROJECTS */}

                    <div className="p-5 md:p-6 border-b sm:border-b-0 sm:border-r lg:border-r border-white/[0.07]">

                        <div className="flex items-center justify-between">

                            <div className="text-xs uppercase tracking-[0.13em] text-zinc-600">
                                Projects
                            </div>

                            <FolderOpen
                                size={16}
                                className="text-zinc-600"
                            />

                        </div>

                        <div className="mt-4 text-3xl font-semibold tracking-tight">
                            {websites?.length || 0}
                        </div>

                        <div className="mt-1 text-xs text-zinc-600">
                            Total websites
                        </div>

                    </div>

                    {/* LIVE */}

                    <div className="p-5 md:p-6 border-b sm:border-b-0 lg:border-r border-white/[0.07]">

                        <div className="flex items-center justify-between">

                            <div className="text-xs uppercase tracking-[0.13em] text-zinc-600">
                                Live
                            </div>

                            <Globe
                                size={16}
                                className="text-zinc-600"
                            />

                        </div>

                        <div className="mt-4 text-3xl font-semibold tracking-tight">
                            {deployedCount}
                        </div>

                        <div className="mt-1 text-xs text-zinc-600">
                            Published websites
                        </div>

                    </div>

                    {/* CREDITS */}

                    <div className="p-5 md:p-6">

                        <div className="flex items-center justify-between">

                            <div className="text-xs uppercase tracking-[0.13em] text-zinc-600">
                                Credits
                            </div>

                            <Coins
                                size={16}
                                className="text-violet-400"
                            />

                        </div>

                        <div className="mt-4 text-3xl font-semibold tracking-tight">
                            {userData?.credits ?? 0}
                        </div>

                        <div className="mt-1 text-xs text-zinc-600">
                            Available for AI actions
                        </div>

                    </div>

                </motion.section>

                {/* LOADING */}

                {loading && (
                    <div className="min-h-[300px] flex flex-col items-center justify-center">

                        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-violet-400 animate-spin" />

                        <p className="mt-4 text-sm text-zinc-600">
                            Loading your workspace...
                        </p>

                    </div>
                )}

                {/* ERROR */}

                {error && (
                    <div className="min-h-[300px] flex items-center justify-center">

                        <div className="max-w-md w-full rounded-2xl border border-red-500/15 bg-red-500/[0.04] p-6 text-center">

                            <div className="mx-auto w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                                <X size={18} />
                            </div>

                            <h2 className="mt-4 font-medium">
                                Something went wrong
                            </h2>

                            <p className="mt-2 text-sm text-red-300/70">
                                {error}
                            </p>

                        </div>

                    </div>
                )}

                {/* EMPTY STATE */}

                {!loading && !error && websites?.length === 0 && (

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] py-20 px-6 text-center"
                    >

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-violet-500/[0.08] blur-[80px]" />

                        <div className="relative">

                            <div className="mx-auto w-12 h-12 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">

                                <Sparkles
                                    size={19}
                                    className="text-violet-300"
                                />

                            </div>

                            <h2 className="mt-6 text-xl font-semibold">
                                Your workspace is empty
                            </h2>

                            <p className="max-w-md mx-auto mt-2 text-sm leading-6 text-zinc-500">
                                Start with an idea and let NOVA turn it into
                                a working website.
                            </p>

                            <button
                                onClick={() => navigate("/generate")}
                                className="mt-7 inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                            >

                                <Sparkles size={15} />
                                Generate your first site

                            </button>

                        </div>

                    </motion.div>
                )}

                {/* PROJECT GRID */}

                {!loading && !error && websites?.length > 0 && (

                    <section>

                        <div className="flex items-center justify-between mb-5">

                            <div>

                                <h2 className="text-lg font-medium">
                                    All websites
                                </h2>

                                <p className="mt-1 text-xs text-zinc-600">
                                    Select a project to continue editing.
                                </p>

                            </div>

                            <div className="text-xs text-zinc-600">
                                {websites.length} project
                                {websites.length === 1 ? "" : "s"}
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                            {websites.map((w, i) => {

                                const copied = copiedId === w._id;

                                return (

                                    <motion.article
                                        key={w._id}
                                        initial={{
                                            opacity: 0,
                                            y: 18,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: i * 0.045,
                                        }}
                                        className="group rounded-2xl border border-white/[0.07] bg-[#0d0f14] overflow-hidden hover:border-white/[0.14] hover:bg-[#101219] transition-all"
                                    >

                                        {/* PREVIEW */}

                                        <div
                                            onClick={() =>
                                                navigate(`/editor/${w._id}`)
                                            }
                                            className="relative h-52 bg-white overflow-hidden cursor-pointer"
                                        >

                                            <iframe
                                                srcDoc={w.latestCode}
                                                title={w.title}
                                                className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none"
                                            />

                                            {/* TOP BAR */}

                                            <div className="absolute top-0 left-0 right-0 h-10 px-3 flex items-center justify-between bg-gradient-to-b from-black/35 to-transparent">

                                                <div className="flex items-center gap-1.5">

                                                    <span className="w-2 h-2 rounded-full bg-white/60" />

                                                    <span className="w-2 h-2 rounded-full bg-white/40" />

                                                    <span className="w-2 h-2 rounded-full bg-white/25" />

                                                </div>

                                                <div className="px-2 py-1 rounded-md bg-black/30 backdrop-blur-md text-[9px] text-white/70">
                                                    PREVIEW
                                                </div>

                                            </div>

                                            {/* HOVER */}

                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all">

                                                <div className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-xs font-semibold shadow-xl">

                                                    Open editor

                                                    <ExternalLink size={13} />

                                                </div>

                                            </div>

                                        </div>

                                        {/* PROJECT INFO */}

                                        <div className="p-5">

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="min-w-0">

                                                    <h3 className="font-medium truncate">
                                                        {w.title}
                                                    </h3>

                                                    <p className="mt-1.5 text-xs text-zinc-600">
                                                        Updated{" "}
                                                        {new Date(
                                                            w.updatedAt
                                                        ).toLocaleDateString()}
                                                    </p>

                                                </div>

                                                {w.deployed && (

                                                    <div className="shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-400/[0.07] border border-emerald-400/[0.12]">

                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                                                        <span className="text-[10px] text-emerald-400 font-medium">
                                                            LIVE
                                                        </span>

                                                    </div>

                                                )}

                                            </div>

                                            {/* ACTION */}

                                            {!w.deployed ? (

                                                <button
                                                    onClick={() =>
                                                        handleDeploy(w._id)
                                                    }
                                                    className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                                                >

                                                    <Rocket size={15} />
                                                    Deploy website

                                                </button>

                                            ) : (

                                                <button
                                                    onClick={() =>
                                                        handleCopy(w)
                                                    }
                                                    className={`mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition ${
                                                        copied
                                                            ? "bg-emerald-400/[0.08] border-emerald-400/20 text-emerald-400"
                                                            : "bg-white/[0.035] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/[0.07]"
                                                    }`}
                                                >

                                                    {copied ? (

                                                        <>
                                                            <Check size={15} />
                                                            Link copied
                                                        </>

                                                    ) : (

                                                        <>
                                                            <Share2 size={15} />
                                                            Copy live link
                                                        </>

                                                    )}

                                                </button>

                                            )}

                                        </div>

                                    </motion.article>

                                );
                            })}

                        </div>

                    </section>

                )}

            </main>

            {/* FOOTER */}

            <footer className="relative z-10 border-t border-white/[0.07] mt-10">

                <div className="max-w-7xl mx-auto px-5 md:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-2 text-sm font-medium">

                        <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center">
                            <Sparkles size={12} />
                        </div>

                        NOVA

                    </div>

                    <p className="text-xs text-zinc-600">
                        AI workspace
                    </p>

                    <button
                        onClick={() => navigate("/")}
                        className="text-xs text-zinc-600 hover:text-white transition"
                    >
                        Back home
                    </button>

                </div>

            </footer>

        </div>
    );
}

export default Dashboard;
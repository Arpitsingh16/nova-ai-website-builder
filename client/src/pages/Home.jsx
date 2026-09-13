import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import {
    ArrowRight,
    Check,
    Layers3,
    LogOut,
    Menu,
    Monitor,
    Sparkles,
    WandSparkles,
    X,
    Zap,
} from "lucide-react";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

function Home() {
    const highlights = [
        {
            number: "01",
            icon: WandSparkles,
            title: "Describe",
            description: "Explain the website you want in plain language.",
        },
        {
            number: "02",
            icon: Sparkles,
            title: "Generate",
            description:
                "NOVA turns your idea into a complete responsive interface.",
        },
        {
            number: "03",
            icon: Monitor,
            title: "Customize",
            description:
                "Open the editor and refine your website exactly how you want.",
        },
    ];

    const [openLogin, setOpenLogin] = useState(false);
    const { userData } = useSelector((state) => state.user);
    const [openProfile, setOpenProfile] = useState(false);
    const [websites, setWebsites] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem("nova_token");

            await axios.get(`${serverUrl}/api/auth/logout`, {
                withCredentials: true,
                headers: token
                    ? {
                          Authorization: `Bearer ${token}`,
                      }
                    : {},
            });

            localStorage.removeItem("nova_token");

            dispatch(setUserData(null));
            setOpenProfile(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!userData) return;

        const handleGetAllWebsites = async () => {
            try {
                const token = localStorage.getItem("nova_token");

                const result = await axios.get(
                    `${serverUrl}/api/website/get-all`,
                    {
                        withCredentials: true,
                        headers: token
                            ? {
                                  Authorization: `Bearer ${token}`,
                              }
                            : {},
                    }
                );

                setWebsites(result.data || []);
            } catch (error) {
                console.log(error);
            }
        };

        handleGetAllWebsites();
    }, [userData]);

    const handleStart = () => {
        if (userData) {
            navigate("/dashboard");
        } else {
            setOpenLogin(true);
        }
    };

    return (
        <div className="min-h-screen bg-[#08090d] text-white overflow-x-hidden">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="fixed inset-0 pointer-events-none">

                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                        `,
                        backgroundSize: "52px 52px",
                    }}
                />

                <div className="absolute top-[-250px] left-[10%] w-[550px] h-[550px] rounded-full bg-violet-600/10 blur-[150px]" />

                <div className="absolute top-[30%] right-[-250px] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[150px]" />

                <div className="absolute bottom-[-300px] left-[30%] w-[500px] h-[500px] rounded-full bg-fuchsia-500/[0.06] blur-[160px]" />

            </div>

            {/* =====================================================
                NAVIGATION
            ====================================================== */}

            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="fixed top-0 left-0 right-0 z-50"
            >

                <div className="mx-auto max-w-7xl px-5 md:px-8 pt-4">

                    <nav className="h-[68px] px-4 md:px-5 flex items-center justify-between rounded-2xl border border-white/[0.08] bg-[#0b0d12]/75 backdrop-blur-2xl shadow-[0_12px_50px_rgba(0,0,0,0.25)]">

                        {/* BRAND */}

                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-3"
                        >

                            <div className="relative w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center overflow-hidden">

                                <div className="absolute w-5 h-5 rounded-full bg-violet-500 blur-[7px]" />

                                <Zap
                                    size={17}
                                    strokeWidth={2.5}
                                    className="relative z-10"
                                />

                            </div>

                            <div className="text-left">

                                <div className="font-semibold tracking-[-0.02em] leading-none">
                                    NOVA
                                </div>

                                <div className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-zinc-500 mt-1">
                                    AI Studio
                                </div>

                            </div>

                        </button>

                        {/* DESKTOP NAV */}

                        <div className="hidden md:flex items-center gap-2">

                            {!userData ? (

                                <button
                                    onClick={() => setOpenLogin(true)}
                                    className="ml-2 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                                >
                                    Enter Studio
                                    <ArrowRight size={15} />
                                </button>

                            ) : (

                                <div className="relative ml-2">

                                    <button
                                        onClick={() =>
                                            setOpenProfile(!openProfile)
                                        }
                                        className="flex items-center gap-2"
                                    >

                                        <img
                                            src={
                                                userData?.avatar ||
                                                `https://ui-avatars.com/api/?name=${userData.name}`
                                            }
                                            alt=""
                                            referrerPolicy="no-referrer"
                                            className="w-9 h-9 rounded-lg border border-white/10 object-cover"
                                        />

                                    </button>

                                    <AnimatePresence>

                                        {openProfile && (

                                            <motion.div
                                                initial={{
                                                    opacity: 0,
                                                    y: -8,
                                                    scale: 0.97,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -8,
                                                    scale: 0.97,
                                                }}
                                                className="absolute right-0 top-12 w-64 overflow-hidden rounded-xl border border-white/[0.08] bg-[#11131a]/95 backdrop-blur-2xl shadow-2xl"
                                            >

                                                <div className="p-4 border-b border-white/[0.07]">

                                                    <div className="text-sm font-medium truncate">
                                                        {userData.name}
                                                    </div>

                                                    <div className="mt-1 text-xs text-zinc-500 truncate">
                                                        {userData.email}
                                                    </div>

                                                </div>

                                                <button
                                                    onClick={() =>
                                                        navigate("/dashboard")
                                                    }
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-zinc-300 hover:text-white hover:bg-white/[0.05] transition"
                                                >
                                                    <Layers3 size={16} />
                                                    Workspace
                                                </button>

                                                <button
                                                    onClick={handleLogOut}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left text-red-400 hover:bg-red-400/[0.06] transition"
                                                >
                                                    <LogOut size={16} />
                                                    Sign out
                                                </button>

                                            </motion.div>

                                        )}

                                    </AnimatePresence>

                                </div>

                            )}

                        </div>

                        {/* MOBILE BUTTON */}

                        <button
                            onClick={() => setMobileMenu(!mobileMenu)}
                            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]"
                        >
                            {mobileMenu ? (
                                <X size={18} />
                            ) : (
                                <Menu size={18} />
                            )}
                        </button>

                    </nav>

                    {/* MOBILE NAV */}

                    <AnimatePresence>

                        {mobileMenu && (

                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                className="md:hidden mt-2 p-2 rounded-2xl border border-white/[0.08] bg-[#101219]/95 backdrop-blur-2xl"
                            >

                                {userData && (
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard");
                                            setMobileMenu(false);
                                        }}
                                        className="w-full px-4 py-3 rounded-xl text-left text-sm text-zinc-300 hover:bg-white/[0.05]"
                                    >
                                        Workspace
                                    </button>
                                )}

                                {!userData && (
                                    <button
                                        onClick={() => {
                                            setOpenLogin(true);
                                            setMobileMenu(false);
                                        }}
                                        className="w-full mt-1 px-4 py-3 rounded-xl bg-white text-black text-sm font-semibold"
                                    >
                                        Enter Studio
                                    </button>
                                )}

                            </motion.div>

                        )}

                    </AnimatePresence>

                </div>

            </motion.header>

            {/* =====================================================
                HERO
            ====================================================== */}

            <main className="relative z-10">

                <section className="min-h-screen flex items-center justify-center px-5 pt-32 pb-20">

                    <div className="w-full max-w-6xl mx-auto text-center">

                        {/* EYEBROW */}

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400"
                        >

                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />

                            AI-powered web creation

                        </motion.div>

                        {/* HEADING */}

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.18, duration: 0.6 }}
                            className="mt-7 text-[clamp(3.2rem,8vw,7.8rem)] leading-[0.9] tracking-[-0.065em] font-semibold"
                        >

                            <span className="block">
                                Ideas into
                            </span>

                            <span className="block mt-2 bg-gradient-to-r from-white via-violet-200 to-violet-500 bg-clip-text text-transparent">
                                real websites.
                            </span>

                        </motion.h1>

                        {/* DESCRIPTION */}

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="max-w-2xl mx-auto mt-8 text-base md:text-lg leading-8 text-zinc-400"
                        >
                            Describe what you want to build.
                            NOVA generates the interface, structure and responsive code
                            so you can move from concept to website faster.
                        </motion.p>

                        {/* CTA */}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-10"
                        >

                            <button
                                onClick={handleStart}
                                className="group w-full sm:w-auto min-w-[190px] px-6 py-3.5 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition"
                            >

                                {userData
                                    ? "Open Workspace"
                                    : "Create a website"}

                                <ArrowRight
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform"
                                />

                            </button>

                        </motion.div>

                        {/* TRUST LINE */}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-10 flex items-center justify-center gap-5 text-xs text-zinc-600"
                        >

                            <span className="flex items-center gap-1.5">
                                <Check size={13} />
                                Responsive output
                            </span>

                            <span className="w-1 h-1 rounded-full bg-zinc-700" />

                            <span className="flex items-center gap-1.5">
                                <Check size={13} />
                                Editable code
                            </span>

                            <span className="w-1 h-1 rounded-full bg-zinc-700" />

                            <span className="flex items-center gap-1.5">
                                <Check size={13} />
                                Fast generation
                            </span>

                        </motion.div>

                    </div>

                </section>

                {/* =====================================================
                    WORKFLOW
                ====================================================== */}

                {!userData && (

                    <section className="px-5 md:px-8 pb-32">

                        <div className="max-w-6xl mx-auto">

                            <div className="flex items-end justify-between mb-8">

                                <div>

                                    <div className="text-xs uppercase tracking-[0.18em] text-violet-400 font-medium">
                                        Simple workflow
                                    </div>

                                    <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                                        From prompt to product.
                                    </h2>

                                </div>

                                <div className="hidden md:block text-sm text-zinc-600">
                                    Three steps. One workspace.
                                </div>

                            </div>

                            <div className="grid md:grid-cols-3 border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.015]">

                                {highlights.map((item, index) => {

                                    const Icon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.number}
                                            initial={{
                                                opacity: 0,
                                                y: 20,
                                            }}
                                            whileInView={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            viewport={{
                                                once: true,
                                            }}
                                            transition={{
                                                delay: index * 0.08,
                                            }}
                                            className={`p-7 md:p-8 min-h-[230px] relative group hover:bg-white/[0.025] transition ${
                                                index !== 2
                                                    ? "border-b md:border-b-0 md:border-r border-white/[0.08]"
                                                    : ""
                                            }`}
                                        >

                                            <div className="flex items-center justify-between">

                                                <span className="text-xs text-zinc-600 font-mono">
                                                    {item.number}
                                                </span>

                                                <div className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-violet-300">
                                                    <Icon size={17} />
                                                </div>

                                            </div>

                                            <div className="mt-12">

                                                <h3 className="text-lg font-medium">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500">
                                                    {item.description}
                                                </p>

                                            </div>

                                        </motion.div>
                                    );
                                })}

                            </div>

                        </div>

                    </section>

                )}

                {/* =====================================================
                    USER WEBSITES
                ====================================================== */}

                {userData && websites?.length > 0 && (

                    <section className="px-5 md:px-8 pb-32">

                        <div className="max-w-6xl mx-auto">

                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-7">

                                <div>

                                    <div className="text-xs uppercase tracking-[0.18em] text-violet-400 font-medium">
                                        Workspace
                                    </div>

                                    <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                                        Recent websites
                                    </h2>

                                </div>

                                <button
                                    onClick={() => navigate("/generate")}
                                    className="self-start sm:self-auto group flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                                >
                                    New website

                                    <ArrowRight
                                        size={15}
                                        className="group-hover:translate-x-1 transition"
                                    />
                                </button>

                            </div>

                            <div className="grid md:grid-cols-3 gap-4">

                                {websites.slice(0, 3).map((w) => (

                                    <motion.div
                                        key={w._id}
                                        initial={{
                                            opacity: 0,
                                            y: 15,
                                        }}
                                        whileInView={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        viewport={{
                                            once: true,
                                        }}
                                        whileHover={{
                                            y: -4,
                                        }}
                                        onClick={() =>
                                            navigate(`/editor/${w._id}`)
                                        }
                                        className="group cursor-pointer rounded-2xl border border-white/[0.08] bg-white/[0.025] overflow-hidden hover:border-violet-400/25 transition-all"
                                    >

                                        <div className="h-48 bg-white overflow-hidden relative">

                                            <iframe
                                                srcDoc={w.latestCode}
                                                className="w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none"
                                                title={w.title}
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />

                                        </div>

                                        <div className="p-5">

                                            <div className="flex items-start justify-between gap-3">

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

                                                <div className="shrink-0 w-8 h-8 rounded-lg border border-white/[0.07] flex items-center justify-center text-zinc-500 group-hover:text-violet-300 transition">
                                                    <ArrowRight size={14} />
                                                </div>

                                            </div>

                                        </div>

                                    </motion.div>

                                ))}

                            </div>

                        </div>

                    </section>

                )}

                {/* =====================================================
                    BOTTOM CTA
                ====================================================== */}

                <section className="px-5 md:px-8 pb-28">

                    <div className="max-w-6xl mx-auto">

                        <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.055] to-white/[0.015] px-7 py-14 md:px-14 md:py-20 text-center">

                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-500/[0.12] blur-[100px]" />

                            <div className="relative">

                                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-violet-300">
                                    <Sparkles size={13} />
                                    Build something new
                                </div>

                                <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-[-0.04em]">
                                    Your next website starts
                                    <span className="text-violet-300">
                                        {" "}
                                        with a prompt.
                                    </span>
                                </h2>

                                <p className="max-w-xl mx-auto mt-5 text-sm md:text-base leading-7 text-zinc-500">
                                    Turn an idea into a working interface without
                                    starting from an empty screen.
                                </p>

                                <button
                                    onClick={handleStart}
                                    className="mt-8 group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition"
                                >
                                    Start building

                                    <ArrowRight
                                        size={15}
                                        className="group-hover:translate-x-1 transition"
                                    />
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer className="relative z-10 border-t border-white/[0.07]">

                <div className="max-w-7xl mx-auto px-5 md:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                        <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center">
                            <Zap size={12} />
                        </div>

                        <span className="text-sm font-medium">
                            NOVA
                        </span>

                    </div>

                    <p className="text-xs text-zinc-600 text-center">
                        © {new Date().getFullYear()} NOVA AI Studio
                    </p>

                </div>

            </footer>

            {/* =====================================================
                LOGIN
            ====================================================== */}

            {openLogin && (
                <LoginModal
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                />
            )}

        </div>
    );
}

export default Home;
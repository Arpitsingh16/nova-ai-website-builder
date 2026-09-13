import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import {
    ArrowRight,
    ShieldCheck,
    Sparkles,
    X
} from "lucide-react";

const MotionDiv = motion.div;
const MotionButton = motion.button;

function LoginModal({ open, onClose }) {
    const dispatch = useDispatch();

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider);

            const { data } = await axios.post(
                `${serverUrl}/api/auth/google`,
                {
                    name: result.user.displayName,
                    email: result.user.email,
                    avatar: result.user.photoURL
                },
                {
                    withCredentials: true
                }
            );

            dispatch(setUserData(data));
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <MotionDiv
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050507]/85 backdrop-blur-xl px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    <MotionDiv
                        initial={{
                            opacity: 0,
                            scale: 0.94,
                            y: 24
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 16
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeOut"
                        }}
                        className="relative w-full max-w-[430px]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* OUTER GLOW */}

                        <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-violet-400/20 via-white/[0.06] to-transparent pointer-events-none" />

                        {/* MODAL */}

                        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#0c0e13] shadow-[0_30px_100px_rgba(0,0,0,0.7)]">

                            {/* BACKGROUND */}

                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="absolute -top-32 -right-24 w-72 h-72 rounded-full bg-violet-500/[0.08] blur-[100px]" />

                                <div className="absolute -bottom-40 -left-24 w-80 h-80 rounded-full bg-indigo-500/[0.06] blur-[120px]" />

                                <div
                                    className="absolute inset-0 opacity-[0.018]"
                                    style={{
                                        backgroundImage: `
                                            linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px),
                                            linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)
                                        `,
                                        backgroundSize: "32px 32px"
                                    }}
                                />
                            </div>

                            {/* CLOSE */}

                            <button
                                onClick={onClose}
                                aria-label="Close login"
                                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg border border-white/[0.07] bg-white/[0.025] flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/[0.07] transition"
                            >
                                <X size={15} />
                            </button>

                            {/* CONTENT */}

                            <div className="relative px-7 sm:px-9 pt-9 pb-8">

                                {/* BRAND */}

                                <div className="flex justify-center">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center shadow-lg">
                                            <Sparkles size={16} />
                                        </div>

                                        <div className="text-left">
                                            <div className="text-sm font-semibold tracking-tight text-white">
                                                NOVA
                                            </div>

                                            <div className="text-[8px] text-zinc-600 uppercase tracking-[0.18em]">
                                                AI Studio
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* HEADING */}

                                <div className="text-center mt-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-400/[0.12] bg-violet-400/[0.04] text-[9px] text-violet-300/80 uppercase tracking-[0.14em]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(139,124,255,0.8)]" />

                                        AI workspace
                                    </div>

                                    <h2 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-white">
                                        Welcome to NOVA
                                    </h2>

                                    <p className="mt-2.5 max-w-xs mx-auto text-xs sm:text-sm leading-6 text-zinc-500">
                                        Sign in to generate, customize, and
                                        deploy your websites.
                                    </p>
                                </div>

                                {/* GOOGLE BUTTON */}

                                <MotionButton
                                    whileHover={{
                                        y: -1
                                    }}
                                    whileTap={{
                                        scale: 0.985
                                    }}
                                    onClick={handleGoogleAuth}
                                    className="group relative w-full mt-8 h-12 rounded-xl bg-white text-black font-semibold text-sm overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.25)] hover:bg-zinc-100 transition"
                                >
                                    <div className="relative h-full flex items-center justify-center gap-3">
                                        <div className="w-6 h-6 rounded-md bg-zinc-100 flex items-center justify-center">
                                            <img
                                                src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                                                alt="Google"
                                                className="w-4 h-4"
                                            />
                                        </div>

                                        <span>
                                            Continue with Google
                                        </span>

                                        <ArrowRight
                                            size={15}
                                            className="text-zinc-400 group-hover:translate-x-0.5 transition"
                                        />
                                    </div>
                                </MotionButton>

                                {/* SECURITY */}

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-600">
                                    <ShieldCheck size={13} />

                                    <span>
                                        Secure authentication powered by Google
                                    </span>
                                </div>

                                {/* DIVIDER */}

                                <div className="flex items-center gap-4 mt-7">
                                    <div className="h-px flex-1 bg-white/[0.07]" />

                                    <span className="text-[9px] uppercase tracking-[0.14em] text-zinc-700">
                                        Secure access
                                    </span>

                                    <div className="h-px flex-1 bg-white/[0.07]" />
                                </div>

                                {/* TERMS */}

                                <p className="mt-6 text-[10px] leading-5 text-center text-zinc-600">
                                    By continuing, you agree to the NOVA{" "}
                                    <span className="text-zinc-400 underline underline-offset-2 cursor-pointer hover:text-white transition">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="text-zinc-400 underline underline-offset-2 cursor-pointer hover:text-white transition">
                                        Privacy Policy
                                    </span>
                                    .
                                </p>
                            </div>

                            {/* BOTTOM STATUS */}

                            <div className="relative px-7 sm:px-9 py-3 border-t border-white/[0.06] bg-white/[0.015]">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_7px_rgba(52,211,153,0.6)]" />

                                    <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-700">
                                        Authentication available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
}

export default LoginModal;
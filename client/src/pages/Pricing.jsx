import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, CheckCircle } from "lucide-react";

function Pricing() {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-[#08090d] text-white overflow-hidden relative">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/10 blur-[140px]" />
                <div className="absolute bottom-[-200px] right-[-100px] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="max-w-3xl mx-auto text-center pt-20">

                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center">
                            <Sparkles size={28} />
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight mb-6">
                        Free Forever
                    </h1>

                    <p className="text-zinc-400 text-lg leading-8 max-w-2xl mx-auto">
                        NOVA is currently available to everyone at no cost.
                        Generate, edit, and deploy websites without purchasing
                        credits or subscriptions.
                    </p>

                    <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8">

                        <h2 className="text-2xl font-semibold mb-8">
                            Everything Included
                        </h2>

                        <div className="grid md:grid-cols-2 gap-5 text-left">

                            {[
                                "AI website generation",
                                "Website editing",
                                "Responsive layouts",
                                "Live preview",
                                "Website deployment",
                                "Unlimited projects",
                                "Modern UI generation",
                                "Future updates"
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle
                                        size={18}
                                        className="text-emerald-400"
                                    />

                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/generate")}
                        className="mt-10 px-8 py-4 rounded-2xl bg-white text-black font-semibold hover:scale-[1.02] transition"
                    >
                        Start Building
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Pricing;
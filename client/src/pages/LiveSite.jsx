import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { Globe, LoaderCircle, Sparkles } from "lucide-react";

function LiveSite() {
    const { id } = useParams();

    const [html, setHtml] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(
                    `${serverUrl}/api/website/get-by-slug/${id}`
                );

                setHtml(result.data.latestCode);
            } catch (error) {
                console.log(error);
                setError("Site not found");
            }
        };

        handleGetWebsite();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08090d] text-white px-6">
                <div className="w-full max-w-md text-center">

                    <div className="mx-auto w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
                        <Globe
                            size={22}
                            className="text-zinc-500"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center">
                            <Sparkles size={12} />
                        </div>

                        <span className="text-sm font-semibold">
                            NOVA
                        </span>
                    </div>

                    <h1 className="mt-5 text-xl font-semibold tracking-tight">
                        Site unavailable
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                        The website you're looking for could not be found.
                    </p>

                    <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] text-[9px] uppercase tracking-[0.14em] text-zinc-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                        Site not found
                    </div>
                </div>
            </div>
        );
    }

    if (!html) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#08090d] text-white">
                <div className="relative w-12 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
                    <Sparkles
                        size={18}
                        className="text-violet-300"
                    />

                    <div className="absolute inset-0 rounded-2xl border border-violet-400/20 animate-pulse" />
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm text-zinc-500">
                    <LoaderCircle
                        size={14}
                        className="animate-spin"
                    />

                    Loading site
                </div>

                <div className="mt-2 text-[9px] uppercase tracking-[0.16em] text-zinc-700">
                    Powered by NOVA
                </div>
            </div>
        );
    }

    return (
        <iframe
            title="Live Site"
            srcDoc={html}
            className="w-screen h-screen border-none block"
            sandbox="allow-scripts allow-same-origin allow-forms"
        />
    );
}

export default LiveSite;
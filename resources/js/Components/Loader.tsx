import { useEffect, useState } from "react";

export default function Loader() {
    const [loading, setLoading] = useState(false);
    const [offsets, setOffsets] = useState<{ top: number; bottom: number }>({
        top: 0,
        bottom: 0,
    });

    useEffect(() => {
        const startLoading = () => setLoading(true);
        const stopLoading = () => setTimeout(() => setLoading(false), 500);

        const clickHandler = (e: any) => {
            const target = e.target as HTMLElement;
            if (
                target?.closest(
                    'a[href]:not([download]):not([target="_blank"])'
                ) ||
                target?.closest('button[type="submit"]')
            ) {
                startLoading();
            }
        };

        const computeOffsets = () => {
            const header = document.getElementById("app-header");
            const footer = document.getElementById("app-footer");
            const headerHeight = header
                ? header.getBoundingClientRect().height
                : 0;
            const footerHeight = footer
                ? footer.getBoundingClientRect().height
                : 0;
            setOffsets({ top: headerHeight, bottom: footerHeight });
        };

        computeOffsets();
        const ro = new ResizeObserver(computeOffsets);
        const headerEl = document.getElementById("app-header");
        const footerEl = document.getElementById("app-footer");
        headerEl && ro.observe(headerEl);
        footerEl && ro.observe(footerEl);
        window.addEventListener("resize", computeOffsets);

        document.addEventListener("inertia:start", startLoading);
        document.addEventListener("inertia:finish", stopLoading);
        document.addEventListener("click", clickHandler);
        return () => {
            document.removeEventListener("inertia:start", startLoading);
            document.removeEventListener("inertia:finish", stopLoading);
            document.removeEventListener("click", clickHandler);
            window.removeEventListener("resize", computeOffsets);
            ro.disconnect();
        };
    }, []);

    if (!loading) return null;

    return (
        <div
            className="fixed left-0 right-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm transition-all"
            style={{ top: offsets.top, bottom: offsets.bottom }}
        >
            <div className="relative flex flex-col items-center ">
                <div className="relative">
                    <div className="size-16 rounded-full border-4 border-transparent border-t-sky-400 border-r-indigo-300 animate-spin-slow" />
                    <div className="absolute inset-0 m-auto size-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-400 animate-pulse-soft" />
                </div>
            </div>

            <style>{`
            @keyframes spin-slow { 0%{ transform: rotate(0deg);} 100%{ transform: rotate(360deg);} }
            .animate-spin-slow { animation: spin-slow 1.2s linear infinite; }
            @keyframes pulse-soft { 0%,100%{ opacity: .6; transform: scale(1);} 50%{ opacity: 1; transform: scale(1.08);} }
            .animate-pulse-soft { animation: pulse-soft 1.6s ease-in-out infinite; }
            `}</style>
        </div>
    );
}

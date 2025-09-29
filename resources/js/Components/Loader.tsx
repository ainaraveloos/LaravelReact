import { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const startLoading = () => setLoading(true);
    const stopLoading = () => setTimeout(() => setLoading(false), 500);

    const clickHandler = (e: any) => {
      const target = e.target as HTMLElement;
      if (
        target?.closest('a[href]:not([download]):not([target="_blank"])') ||
        target?.closest('button[type="submit"]')
      ) {
        startLoading();
      }
    };

    document.addEventListener("inertia:start", startLoading);
    document.addEventListener("inertia:finish", stopLoading);
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("inertia:start", startLoading);
      document.removeEventListener("inertia:finish", stopLoading);
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-white/90 backdrop-blur-md transition-all duration-300">
            <div className="flex flex-col items-center relative">
                <div className="flex items-center logo-container">
                    <span className="logo-letter text-primary font-black text-5xl mr-2">
                        T
                    </span>
                    <div
                        className="relative inline-block mx-3 truck-bounce"
                        style={{ ["--delay" as any]: "300ms" }}
                    >
                        <div className="w-16 h-14 flex items-center justify-center rounded-lg relative overflow-hidden shadow-lg bg-blue-600">
                            <div className="shimmer absolute top-0 w-full h-full"></div>
                            <svg
                                className="w-12 h-8 text-white truck-move"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M3 17h2c0 1.1.9 2 2 2s2-.9 2-2h6c0 1.1.9 2 2 2s2-.9 2-2h2v-2H3v2z" />
                                <path d="M3 13h12v-2H3v2z" />
                                <path d="M16 13h5l-3-4h-2v4z" />
                                <path d="M3 11h12V8H3v3z" />
                                <circle cx="7" cy="17" r="1" />
                                <circle cx="17" cy="17" r="1" />
                            </svg>
                        </div>
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-300 rounded overflow-hidden">
                            <div className="road-line absolute top-0 w-full h-full"></div>
                        </div>
                    </div>
                    <span className="logo-letter text-primary font-black text-5xl mx-2">
                        M
                    </span>
                    <span className="logo-letter text-primary font-black text-5xl">
                        S
                    </span>
                </div>

                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">
                        Transport Management System
                    </h3>
                    <p className="text-sm text-gray-500">
                        Chargement en cours...
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center">
                    <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div className="progress-bar h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                    </div>
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-blue-600 ant-loading-dot"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-cyan-500 ant-loading-dot"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-blue-600 ant-loading-dot"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-cyan-500 ant-loading-dot"></span>
                    </div>
                </div>

                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/4 right-1/4 opacity-5">
                        <svg
                            className="w-16 h-16 float-icon"
                            viewBox="0 0 24 24"
                            fill="#0073AC"
                        >
                            <path d="M2 20h20v-4H2v4zm2-6h16V6H4v8z" />
                        </svg>
                    </div>
                    <div className="absolute top-1/3 left-1/4 opacity-5">
                        <svg
                            className="w-12 h-12 float-icon"
                            viewBox="0 0 24 24"
                            fill="#005a87"
                        >
                            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                    </div>
                    <div className="absolute bottom-1/3 right-1/3 opacity-5">
                        <svg
                            className="w-14 h-14 float-icon"
                            viewBox="0 0 24 24"
                            fill="#004066"
                        >
                            <path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.32-.42-.58-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.46.26-.58.5s-.14.52-.06.78L3.95 19z" />
                        </svg>
                    </div>
                </div>
            </div>

            <style>{`
            .logo-container { filter: drop-shadow(0 6px 12px rgba(59,130,246,0.15)); }
            .logo-letter { position: relative; text-shadow: 0 2px 4px rgba(30,64,175,0.2); }
            .truck-bounce { animation: truck-bounce-anim 2s ease-in-out infinite; transform-origin: center bottom; }
            @keyframes truck-bounce-anim { 0%,20%,50%,80%,100%{ transform: translateY(0) scale(1);} 40%{ transform: translateY(-8px) scale(1.05);} 60%{ transform: translateY(-4px) scale(1.02);} }
            .truck-move { animation: truck-shake 1.5s ease-in-out infinite; }
            @keyframes truck-shake { 0%,100%{ transform: translateX(0) rotate(0deg);} 25%{ transform: translateX(1px) rotate(0.5deg);} 50%{ transform: translateX(0) rotate(0deg);} 75%{ transform: translateX(-1px) rotate(-0.5deg);} }
            .shimmer { left:-100%; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%); animation: shimmer-anim 2.5s infinite; }
            @keyframes shimmer-anim { 0%{ left:-100%; } 100%{ left:100%; } }
            .road-line { left:-100%; width:200%; background: repeating-linear-gradient(to right, transparent 0px, transparent 8px, #001c47 8px, #001c47 16px); animation: road-move 1s linear infinite; }
            @keyframes road-move { 0%{ transform: translateX(0);} 100%{ transform: translateX(16px);} }
            .progress-bar { width:0%; animation: progress-fill 3s ease-in-out infinite; }
            @keyframes progress-fill { 0%{ width:0%; } 50%{ width:70%; } 100%{ width:100%; } }
            .ant-loading-dot { animation: ant-dot-bounce 1.4s infinite ease-in-out both; }
            .ant-loading-dot:nth-child(1){ animation-delay:-0.32s; }
            .ant-loading-dot:nth-child(2){ animation-delay:-0.16s; }
            .ant-loading-dot:nth-child(4){ animation-delay:0.16s; }
            @keyframes ant-dot-bounce { 0%,80%,100%{ transform: scale(0.8); opacity:0.5;} 40%{ transform: scale(1.2); opacity:1;} }
            .float-icon { animation: float-bg 6s ease-in-out infinite; }
            @keyframes float-bg { 0%,100%{ transform: translateY(0px) rotate(0deg);} 33%{ transform: translateY(-10px) rotate(5deg);} 66%{ transform: translateY(5px) rotate(-3deg);} }
            `}</style>
        </div>
    );
}

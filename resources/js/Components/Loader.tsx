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

                <div className="mt-6 flex flex-col items-center">
                    <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-blue-600 animate-ping"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-cyan-500 animate-ping"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-blue-600 animate-ping"></span>
                        <span className="w-2.5 h-2.5 rounded-full mx-1 inline-block bg-cyan-500 animate-ping"></span>
                    </div>
                </div>
            </div>

        </div>
    );
}

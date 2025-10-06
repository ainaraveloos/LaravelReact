import { PropsWithChildren } from "react";
import Layout from "./Layout";

export default function Guest({ children }: PropsWithChildren) {
    return (
        <Layout>
            <div className="min-h-screen bg-slate-800 lg:p-4 p-8 flex items-center justify-center">
                <div className="w-full max-w-6xl bg-gray-50 rounded-xl shadow-xl flex flex-col lg:flex-row">
                    {/* Left Section - Login Form */}
                    <div className="w-full lg:w-1/2 p-8 lg:p-12 xl:p-14">
                        {children}
                    </div>

                    {/* Right Section - Background Image */}
                    <div className="hidden lg:flex flex-1  rounded-r-xl items-center justify-center p-0 overflow-hidden relative">
                        <div className="group w-full h-full">
                            {/* Background Image Placeholder - You can replace this with an actual image */}
                            <div className="w-full h-full  group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                                <div className="text-center">
                                    {/* Ajouter image ici */}
                                </div>
                            </div>

                            {/* Texte par dessus */}
                            <div className="absolute inset-0 bg-slate-800 group-hover:bg-slate-800/90 transition-colors duration-500 flex flex-col justify-end p-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

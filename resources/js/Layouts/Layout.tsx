import Loader from "@/Components/Loader";
import { usePage } from "@inertiajs/react";
import { PropsWithChildren, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }: PropsWithChildren) {
    const page = usePage();
    const message = (page.props as any)?.message || {};

    useEffect(() => {
        if (message?.success) {
            toast.success(String(message.success));
        }
        if (message?.error) {
            toast.error(String(message.error));
        }
    }, [message?.success, message?.error]);

    return (
        <>
            <Loader/>
            <ToastContainer
                position="top-center"
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="light"
            />
            {children}
        </>
    );
}

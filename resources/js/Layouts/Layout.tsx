import Loader from "@/Components/Loader";
import { usePage } from "@inertiajs/react";
import { message as antdMessage } from "antd";
import { PropsWithChildren, useEffect } from "react";

export default function Layout({ children }: PropsWithChildren) {
    const page = usePage();
    const message = (page.props as any)?.message || {};

    useEffect(() => {
        if (message?.success) {
            antdMessage.success(String(message.success));
        }
        if (message?.error) {
            antdMessage.error(String(message.error));
        }
    }, [message?.success, message?.error]);

    return (
        <>
            <Loader />
            {children}
        </>
    );
}

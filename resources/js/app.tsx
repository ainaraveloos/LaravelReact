import "../css/app.css";
import "./bootstrap";
import "./lib/icons";

import { createInertiaApp } from "@inertiajs/react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { defaultTheme } from "./lib/theme";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ConfigProvider
                theme={{
                    cssVar: true,
                    token: {
                        colorPrimary: defaultTheme.colors.primary,
                        colorSecondary: defaultTheme.colors.secondary,
                        colorText: defaultTheme.colors.foreground,
                        colorBgBase: defaultTheme.colors.background,
                    },
                    algorithm: antdTheme.defaultAlgorithm,
                }}
            >
                <App {...props} />
            </ConfigProvider>
        );
    },
    progress: false,
});

import { applyCssVars, darkTheme, defaultTheme } from "@/lib/theme";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

export function useTheme() {
    const [theme, setTheme] = useState<ThemeMode>(() => {
        // Récupérer le thème depuis localStorage ou détecter la préférence système
        const savedTheme = localStorage.getItem("theme") as ThemeMode;
        if (savedTheme) {
            return savedTheme;
        }

        // Détecter la préférence système
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        return "light";
    });

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        // Appliquer le thème sélectionné
        const currentTheme = theme === "dark" ? darkTheme : defaultTheme;
        applyCssVars(currentTheme);

        // Ajouter/supprimer la classe dark sur le document
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    return {
        theme,
        toggleTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
    };
}

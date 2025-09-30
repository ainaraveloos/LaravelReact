export type AppTheme = {
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        muted: string;
        destructive: string;
        background: string;
        foreground: string;
    };
    radius: string;
};

export const defaultTheme: AppTheme = {
    colors: {
        primary: "#202B3A", // gray-800
        secondary: "#D7670C", // gray-600
        accent: "#3b82f6", // blue-500
        muted: "#6b7280", // gray-500
        destructive: "#ef4444", // red-500
        background: "#ffffff",
        foreground: "#0f172a", // slate-900
    },
    radius: "0.75rem",
};

export const darkTheme: AppTheme = {
    colors: {
        primary: "#93c5fd", // blue-300
        secondary: "#a3a3a3", // neutral-400
        accent: "#60a5fa", // blue-400
        muted: "#737373", // neutral-500
        destructive: "#f87171", // red-400
        background: "#0b1220",
        foreground: "#e5e7eb",
    },
    radius: "0.75rem",
};

export function applyCssVars(theme: AppTheme): void {
    const root = document.documentElement;
    root.style.setProperty("--primary", hexToHsl(theme.colors.primary));
    root.style.setProperty(
        "--primary-foreground",
        hexToHsl(theme.colors.foreground)
    );
    root.style.setProperty("--secondary", hexToHsl(theme.colors.secondary));
    root.style.setProperty(
        "--secondary-foreground",
        hexToHsl(theme.colors.foreground)
    );
    root.style.setProperty("--accent", hexToHsl(theme.colors.accent));
    root.style.setProperty(
        "--accent-foreground",
        hexToHsl(theme.colors.foreground)
    );
    root.style.setProperty("--muted", hexToHsl(theme.colors.muted));
    root.style.setProperty(
        "--muted-foreground",
        hexToHsl(theme.colors.foreground)
    );
    root.style.setProperty("--destructive", hexToHsl(theme.colors.destructive));
    root.style.setProperty(
        "--destructive-foreground",
        hexToHsl(theme.colors.foreground)
    );
    root.style.setProperty("--background", hexToHsl(theme.colors.background));
    root.style.setProperty("--foreground", hexToHsl(theme.colors.foreground));
    root.style.setProperty("--radius", theme.radius);
}

function hexToHsl(hex: string): string {
    const { r, g, b } = hexToRgb(hex);
    // Convert RGB 0-255 to HSL string for tailwind CSS variables
    const [h, s, l] = rgbToHsl(r / 255, g / 255, b / 255);
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const clean = hex.replace("#", "");
    const bigint = parseInt(
        clean.length === 3
            ? clean
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : clean,
        16
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h * 360, s, l];
}

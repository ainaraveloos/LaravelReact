import { useTheme } from "@/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Tooltip } from "antd";

interface ThemeToggleProps {
    size?: "small" | "middle" | "large";
    className?: string;
    showText?: boolean;
}

export default function ThemeToggle({
    size = "middle",
    className = "",
    showText = false,
}: ThemeToggleProps) {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <Tooltip
            title={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
        >
            <Button
                type="text"
                size={size}
                onClick={toggleTheme}
                className={`flex items-center gap-2 ${className}`}
                icon={
                    <FontAwesomeIcon
                        icon={isDark ? "sun" : "moon"}
                        className="text-lg"
                    />
                }
            >
                {showText && (
                    <span className="hidden sm:inline">
                        {isDark ? "Clair" : "Sombre"}
                    </span>
                )}
            </Button>
        </Tooltip>
    );
}

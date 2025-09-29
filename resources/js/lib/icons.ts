// Centralized Font Awesome setup for tree-shaken, per-icon imports
// Import only the icons you use here
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

// Prevent Font Awesome from adding its CSS automatically
config.autoAddCss = false;

// Example: export commonly used icons for convenient imports
export {
    faEllipsis,
    faHouse,
    faRightFromBracket,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

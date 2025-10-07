// Centralized Font Awesome setup for tree-shaken, per-icon imports
// Import only the icons you use here
import { config, library } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faCog, faEdit, faEllipsis, faFilter, faHouse, faRefresh, faRightFromBracket, faTrash, faUser, faDownload } from "@fortawesome/free-solid-svg-icons";

// Prevent Font Awesome from adding its CSS automatically
config.autoAddCss = false;
library.add( faUser,faFilter,faHouse,faRefresh,faRightFromBracket,faUser,faCog,faEllipsis,faTrash,faEdit,faDownload);

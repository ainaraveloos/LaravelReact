import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@inertiajs/react";
import { Button, Dropdown } from "antd";
import { useEffect, useMemo, useState } from "react";

type HeaderItem = {
    key: string;
    label: string;
    routeName?: string | null;
};

export default function HeaderBar({ items = [] as HeaderItem[] }) {
    const [visibleCount, setVisibleCount] = useState(2);

    useEffect(() => {
        const computeVisible = () => {
            const width = window.innerWidth;
            if (width >= 1536) {
                // 2xl
                setVisibleCount(Math.min(8, items.length));
            } else if (width >= 1280) {
                // xl
                setVisibleCount(Math.min(6, items.length));
            } else if (width >= 800) {
                // lg
                setVisibleCount(Math.min(4, items.length));
            } else if (width >= 640) {
                // md
                setVisibleCount(Math.min(3, items.length));
            } else if (width >= 480) {
                // sm
                setVisibleCount(Math.min(2, items.length));
            } else {
                // mobile
                setVisibleCount(Math.min(0, items.length));
            }
        };
        computeVisible();
        window.addEventListener("resize", computeVisible);
        return () => window.removeEventListener("resize", computeVisible);
    }, [items.length]);

    const displayedItems = useMemo( () => items.slice(0, visibleCount), [items, visibleCount] );
    const overflowItems = useMemo( () => items.slice(visibleCount), [items, visibleCount] );
    if (!items || items.length === 0) { return null; }

    return (
        <div className="relative w-full">
            <nav className="flex items-center gap-2 sm:gap-3 lg:gap-4 overflow-x-auto no-scrollbar">
                <Link as="button" href={route("menu")}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex-shrink-0"
                >
                    <FontAwesomeIcon icon="house" className="h-3 w-3 sm:h-4 sm:w-4"/>

                </Link>
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    {displayedItems.map((item) => {
                        const isActive = item.routeName ? route().current(item.routeName) : false;
                        const href = item.routeName ? route(item.routeName as any) : "#";
                        return (
                            <Link as="button" key={item.key} href={href}
                                className={
                                    "relative inline-flex items-center rounded-lg px-2.5 sm:px-3.5 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors flex-shrink-0 whitespace-nowrap border " +
                                    (isActive
                                        ? "bg-slate-50 text-slate-800 border-slate-300"
                                        : "bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-slate-200")
                                }
                            >
                                <span className="relative">
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-full rounded-full bg-slate-300"></span>
                                    )}
                                </span>
                            </Link>
                        );
                    })}
                    {overflowItems.length > 0 && (
                        <Dropdown trigger={["click"]} menu={{ items: overflowItems.map((item) => ({
                                    key: item.key,
                                    label: (
                                        <Link href={ item.routeName ? (route( item.routeName as any ) as string) : "#" }
                                            className="block px-3 py-2 text-sm hover:bg-slate-50 rounded-md transition-colors text-slate-700"
                                        >
                                            {item.label}
                                        </Link>
                                    ),
                                })),
                            }}
                        >
                            <Button type="default" size="middle"
                                className="inline-flex items-center bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 flex-shrink-0"
                            >
                                <FontAwesomeIcon icon="ellipsis" className="h-3 w-3 sm:h-4 sm:w-4"/>
                            </Button>
                        </Dropdown>
                    )}
                </div>
            </nav>
        </div>
    );
}

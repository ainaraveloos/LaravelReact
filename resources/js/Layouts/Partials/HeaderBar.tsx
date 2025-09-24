import { Link } from "@inertiajs/react";

type HeaderItem = {
    key: string;
    label: string;
    routeName?: string | null;
};

export default function HeaderBar({ items = [] as HeaderItem[] }) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {items.map((item) => {
                    const isActive = item.routeName
                        ? route().current(item.routeName)
                        : false;
                    const href = item.routeName
                        ? route(item.routeName as any)
                        : "#";
                    return (
                        <Link
                            key={item.key}
                            href={href}
                            className={
                                "relative inline-flex items-center rounded-full px-3 py-1 text-sm transition " +
                                (isActive
                                    ? "bg-gray-900 text-white shadow"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200")
                            }
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getMenuData } from "@/Utils/MenuData";
import { filterMenuByPrivileges } from "@/Utils/MenuFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, router, usePage } from "@inertiajs/react";

export default function MenuIndex() {
    const page = usePage<{ auth: { user: any } }>();
    const user = page.props.auth.user;
    const rawMenu = getMenuData();

    // Build privileges list from user for MenuFilter (fallback to [])
    const userPrivileges: string[] = [
        ...(Array.isArray((user as any)?.accepted_routes) ? (user as any).accepted_routes : Object.values((user as any)?.accepted_routes || {})),
        ...(Array.isArray((user as any)?.permissions) ? (user as any).permissions : Object.values((user as any)?.permissions || {})),
    ].map(String);

    const filteredMenu = filterMenuByPrivileges( rawMenu, userPrivileges, Boolean((user as any)?.is_dna))


    const handleMenuClick = (module: any) => {
        const children = Array.isArray(module.children) ? module.children : [];
        const firstChild = children[0];
        if (firstChild?.routeName) {
            router.get(route(firstChild.routeName));
            return;
        }
        router.get( route("dashboard"), { module: module.key }, { preserveState: true } );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Menu" />
            <div className="">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredMenu.map((module: any) => {
                            const children = Array.isArray(module.children)  ? module.children : [];
                            return (
                                <div
                                    key={module.key}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={module.label}
                                    onClick={() => handleMenuClick(module)}
                                    onKeyDown={(e) => { if ( e.key === "Enter" || e.key === " " ) { e.preventDefault(), handleMenuClick(module) } }}
                                    className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
                                >
                                    <div aria-hidden className="pointer-events-none absolute inset-0" >
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                        {/* Bottom progress bar */}
                                        <div className="absolute bottom-0 left-0 h-0.5 w-full overflow-hidden bg-transparent">
                                            <span className="block h-full w-0 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 transition-[width] duration-500 ease-out group-hover:w-full" />
                                        </div>
                                    </div>

                                    <div className="relative p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition-transform duration-300 group-hover:translate-x-0.5">
                                                    <FontAwesomeIcon icon={`${module.icon}`} className="text-2xl" aria-hidden="true"/>
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-600 text-lg lg:text-xl font-semibold tracking-tight">
                                                        {module.label.toUpperCase()}
                                                    </h3>
                                                    {children.length > 0 && (
                                                        <p className="mt-1 text-slate-500 text-sm">
                                                            {children.length}{" "}
                                                            option
                                                            {children.length > 1
                                                                ? "s"
                                                                : ""}{" "}
                                                            disponibles
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-1 text-slate-400 transition-transform duration-300 group-hover:translate-x-6 group-hover:text-slate-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" >
                                                    <path fillRule="evenodd" d="M8.47 4.97a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L13.94 12 8.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd"/>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

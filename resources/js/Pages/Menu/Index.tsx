import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { getMenuData } from "@/Utils/MenuData";
import { filterMenuByPrivileges } from "@/Utils/MenuFilter";
import usePermissions from "@/hooks/usePermissions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Head, router, usePage } from "@inertiajs/react";

export default function MenuIndex() {
    const page = usePage<{ auth: { user: any } }>();
    const user = page.props.auth.user;
    const { can } = usePermissions();

    const rawMenu = getMenuData();

    // Build privileges list from user for MenuFilter (fallback to [])
    const userPrivileges: string[] = [
        ...(Array.isArray((user as any)?.accepted_routes) ? (user as any).accepted_routes : Object.values((user as any)?.accepted_routes || {})),
        ...(Array.isArray((user as any)?.permissions) ? (user as any).permissions : Object.values((user as any)?.permissions || {})),
    ].map(String);

    const filteredMenu = filterMenuByPrivileges(rawMenu, userPrivileges, Boolean((user as any)?.is_dna));

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
                            const primaryColor = module.gradient?.[0] || "#0f172a";
                            const secondaryColor = module.gradient?.[1] || "#334155";
                            const children = Array.isArray(module.children) ? module.children : [];
                            return (
                                <div key={module.key} role="button" tabIndex={0} aria-label={module.label} onClick={() => handleMenuClick(module)}
                                    onKeyDown={(e) => { if ( e.key === "Enter" || e.key === " " ) { e.preventDefault(); handleMenuClick(module); }}}
                                    className="group relative h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
                                >
                                    {/* Accent strip */}
                                    <div className="absolute left-0 top-0 h-full w-1" style={{ background: primaryColor }}/>

                                    <div className="relative p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
                                                    style={{ color: primaryColor, borderColor: `${primaryColor}33`}}
                                                >
                                                    <FontAwesomeIcon icon={`${module.icon}`} className="text-3xl" aria-hidden="true" />
                                                </div>
                                                <div>
                                                    <h3 className="text-slate-900 text-lg lg:text-xl font-semibold tracking-tight">
                                                        {module.label}
                                                    </h3>
                                                </div>
                                            </div>
                                            <div className="mt-1 text-slate-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M8.47 4.97a.75.75 0 011.06 0l6 6a.75.75 0 010 1.06l-6 6a.75.75 0 11-1.06-1.06L13.94 12 8.47 6.53a.75.75 0 010-1.06z"
                                                        clipRule="evenodd"
                                                    />
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

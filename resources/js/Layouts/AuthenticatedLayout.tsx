import ApplicationLogo from "@/Components/ApplicationLogo";
import { Button } from "@/Components/ui/button";
// Sidebar imports removed — switching to top header layout
import FooterBar from "@/Layouts/Partials/FooterBar";
import HeaderBar from "@/Layouts/Partials/HeaderBar";
import { getMenuData } from "@/Utils/MenuData";
import { filterMenuByPrivileges } from "@/Utils/MenuFilter";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const page = usePage();
    const params = (route() as any)?.params || {};
    const selectedModule = (params as any).module as string | undefined;

    // Build privileges array for filtering
    const privileges: string[] = [
        ...(Array.isArray((user as any)?.accepted_routes)
            ? (user as any).accepted_routes
            : Object.values((user as any)?.accepted_routes || {})),
        ...(Array.isArray((user as any)?.permissions)
            ? (user as any).permissions
            : Object.values((user as any)?.permissions || {})),
    ].map(String);

    const allMenu = getMenuData();
    const filteredMenu = filterMenuByPrivileges(
        allMenu,
        privileges,
        Boolean((user as any)?.is_dna)
    );
    let currentSection = filteredMenu.find(
        (m: any) => m.key === selectedModule
    );
    if (!currentSection) {
        currentSection = filteredMenu.find((m: any) =>
            Array.isArray(m.children)
                ? m.children.some((c: any) =>
                      c.routeName ? route().current(c.routeName) : false
                  )
                : false
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <header className="fixed z-50 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="w-full px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="block h-7 w-auto fill-current text-gray-800" />
                    </Link>
                    {currentSection && (
                        <div className="hidden md:block">
                            <div className="px-2">
                                <HeaderBar
                                    items={(currentSection.children || []).map(
                                        (c: any) => ({
                                            key: c.key,
                                            label: c.label,
                                            routeName: c.routeName,
                                        })
                                    )}
                                />
                            </div>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                        <span className="hidden sm:inline text-gray-600">
                            {user.email}
                        </span>
                        <Button asChild size="sm" variant="outline">
                            <Link href={route("profile.edit")}>Profile</Link>
                        </Button>
                        <Button asChild size="sm" variant="destructive">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Logout
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Contenu de la page */}
            <main className="p-4 sm:px-6 lg:px-8 flex-1 mt-20">{children}</main>

            <footer className="border-t bg-white">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <FooterBar />
                </div>
            </footer>
        </div>
    );
}

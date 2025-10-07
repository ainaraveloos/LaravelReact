import ApplicationLogo from "@/Components/ApplicationLogo";
// Sidebar imports removed — switching to top header layout
import Layout from "@/Layouts/Layout";
import FooterBar from "@/Layouts/Partials/FooterBar";
import HeaderBar from "@/Layouts/Partials/HeaderBar";
import { getMenuData } from "@/Utils/MenuData";
import { filterMenuByPrivileges } from "@/Utils/MenuFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, usePage } from "@inertiajs/react";
import { Avatar, Dropdown } from "antd";
import { PropsWithChildren, ReactNode } from "react";

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const params = (route() as any)?.params || {};
    const selectedModule = (params as any).module as string | undefined;

    // Build privileges array for filtering
    const privileges: string[] = [
        ...(Array.isArray((user as any)?.accepted_routes) ? (user as any).accepted_routes : Object.values((user as any)?.accepted_routes || {})),
        ...(Array.isArray((user as any)?.permissions) ? (user as any).permissions : Object.values((user as any)?.permissions || {})),
    ].map(String);

    const allMenu = getMenuData();
    const filteredMenu = filterMenuByPrivileges( allMenu, privileges, Boolean((user as any)?.is_dna));
    let currentSection = filteredMenu.find( (m: any) => m.key === selectedModule );
    if (!currentSection) {
        currentSection = filteredMenu.find((m: any) => Array.isArray(m.children) ? m.children.some((c: any) => c.routeName ? route().current(c.routeName) : false) : false );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* Header */}
                <header className="fixed z-50 w-full bg-white/90 backdrop-blur border-b border-app-header">
                    <div className="w-full px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2"> <ApplicationLogo className="block h-6 w-auto fill-current text-app-primary" /></Link>

                        {currentSection && (
                            <div className="flex-1  mx-4 sm:mx-8">
                                <div className="rounded-xl p-1.5 border border-app bg-app-secondary shadow-inner">
                                    <HeaderBar items={( currentSection.children || [] ).map((c: any) => ({ key: c.key, label: c.label, routeName: c.routeName }))}/>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center">
                            <Dropdown trigger={["click"]}
                                menu={{
                                    items: [
                                        {
                                            key: "user-info",
                                            label: (
                                                <div className="px-3 py-2 border-b border-app bg-app-secondary">
                                                    <div className="text-sm font-medium text-app-primary"> {" "} {user.name || "Utilisateur"}{" "} </div>
                                                    <div className="text-xs text-app-secondary"> {" "} {user.email}{" "} </div>
                                                </div>
                                            ),
                                            disabled: true,
                                        },
                                        {
                                            key: "profile",
                                            label: (
                                                <Link href={route("profile.edit")} className="block px-3 py-2 text-app-primary hover:bg-app-secondary hover:text-app-primary transition-colors">
                                                    <span className="inline-flex items-center gap-2">
                                                        <FontAwesomeIcon icon="user" className="h-3.5 w-3.5" />
                                                        <span>Profile</span>
                                                    </span>
                                                </Link>
                                            ),
                                        },
                                        { type: "divider" },
                                        {
                                            key: "logout",
                                            label: (
                                                <Link href={route("logout")} method="post" as="button" className="block px-3 py-2 text-app-error hover:bg-app-error/10 hover:text-app-error transition-colors">
                                                    <span className="inline-flex items-center gap-2">
                                                        <FontAwesomeIcon icon="right-from-bracket" className="h-3.5 w-3.5"  />
                                                        <span>Logout</span>
                                                    </span>
                                                </Link>
                                            ),
                                        },
                                    ],
                                }}
                            >
                                <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-app bg-app-card hover:bg-app-secondary hover:border-app-strong transition-colors">
                                    <Avatar size={28} className="bg-app-secondary text-app-primary" >
                                        {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
                                    </Avatar>
                                    <span className="hidden sm:inline text-app-primary text-sm font-medium">
                                        { (user?.name || user?.email || "User" ).split(" ")[0] }
                                    </span>
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Contenu de la page */}
                <main className="p-4 sm:px-6 lg:px-8 flex-1 mt-20 bg-app-content"> {children} </main>

                {/* Footer */}
                <footer className="border-t border-app bg-app-card">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"> <FooterBar /> </div>
                </footer>
            </div>
        </Layout>
    );
}

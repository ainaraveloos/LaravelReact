import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Building2, Database, Settings, Users } from "lucide-react";

interface Tenant {
    id: string;
    nom_client: string;
    data: any;
}

interface Props {
    tenant: Tenant;
    tenant_id: string;
    tenant_name: string;
}

export default function Dashboard({ tenant, tenant_id, tenant_name }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Building2 className="h-6 w-6" />
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {tenant_name || "Dashboard Tenant"}
                        </h2>
                        <p className="text-sm text-gray-600">ID: {tenant_id}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Dashboard - ${tenant_name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Message de bienvenue */}
                    <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            Bienvenue dans votre espace tenant !
                        </h1>
                        <p className="text-blue-100">
                            Vous êtes connecté à l'instance dédiée de{" "}
                            <strong>{tenant_name}</strong>
                        </p>
                    </div>

                    {/* Informations du tenant */}
                    <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tenant ID
                                </CardTitle>
                                <Database className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold font-mono">
                                    {tenant_id}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Identifiant unique du tenant
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Nom du client
                                </CardTitle>
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {tenant_name}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Organisation associée
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Statut
                                </CardTitle>
                                <Settings className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <Badge variant="default" className="text-sm">
                                    Actif
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Tenant opérationnel
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions rapides */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Gestion des utilisateurs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Gérez les utilisateurs et leurs permissions
                                    dans cet espace tenant.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={route("users.index")}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Voir les utilisateurs
                                    </a>
                                    <a
                                        href={route("user-groups.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Groupes d'utilisateurs
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Configurez les paramètres spécifiques à
                                    votre organisation.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={route("profile.edit")}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Mon profil
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informations techniques */}
                    {tenant.data && Object.keys(tenant.data).length > 0 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Données du tenant</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                                    {JSON.stringify(tenant.data, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Calendar, Database, ExternalLink } from "lucide-react";

interface Domain {
    id: number;
    domain: string;
    created_at: string;
}

interface Tenant {
    id: string;
    nom_client: string;
    data: any;
    domains: Domain[];
    created_at: string;
    updated_at: string;
}

interface Props {
    tenant: Tenant;
}

export default function Show({ tenant }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route("tenants.index")}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Détails du tenant: {tenant.nom_client}
                    </h2>
                </div>
            }
        >
            <Head title={`Tenant: ${tenant.nom_client}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Database className="h-5 w-5" />
                                Informations générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        ID du tenant
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                        {tenant.id}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Nom du client
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {tenant.nom_client}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Date de création
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(
                                            tenant.created_at
                                        ).toLocaleString("fr-FR")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Dernière modification
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(
                                            tenant.updated_at
                                        ).toLocaleString("fr-FR")}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Domaines */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ExternalLink className="h-5 w-5" />
                                Domaines associés
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tenant.domains.length > 0 ? (
                                <div className="space-y-3">
                                    {tenant.domains.map((domain) => (
                                        <div
                                            key={domain.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary">
                                                    {domain.domain}
                                                </Badge>
                                                <a
                                                    href={`http://${domain.domain}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                >
                                                    Visiter
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Créé le{" "}
                                                {new Date(
                                                    domain.created_at
                                                ).toLocaleDateString("fr-FR")}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Aucun domaine associé à ce tenant.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Données additionnelles */}
                    {tenant.data && Object.keys(tenant.data).length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Données additionnelles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                                    {JSON.stringify(tenant.data, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    )}

                    {/* Informations sur la base de données */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Informations de la base de données
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Nom de la base de données
                                </label>
                                <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                                    tenant{tenant.id}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">
                                    Statut de la base de données
                                </h4>
                                <p className="text-sm text-blue-800">
                                    ✅ Base de données créée et migrations
                                    appliquées
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions disponibles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" asChild>
                                    <a
                                        href={`http://${tenant.domains[0]?.domain}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Accéder au tenant
                                    </a>
                                </Button>
                                <Button variant="outline" disabled>
                                    <Database className="h-4 w-4 mr-2" />
                                    Gérer la base de données
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

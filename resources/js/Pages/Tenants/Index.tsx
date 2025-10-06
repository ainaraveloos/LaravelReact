import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Eye, Plus, Search, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface Domain {
    id: number;
    domain: string;
}

interface Tenant {
    id: string;
    nom_client: string;
    nom_domaine: string;
    domains: Domain[];
    created_at: string;
}

interface Props {
    tenants: {
        data: Tenant[];
        links: any[];
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function Index({ tenants, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route("tenants.index"),
            { search },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleDelete = (tenant: Tenant) => {
        if (
            confirm(
                `Êtes-vous sûr de vouloir supprimer le tenant "${tenant.nom_client}" ? Cette action est irréversible.`
            )
        ) {
            router.delete(route("tenants.destroy", tenant.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Gestion des Tenants (Sous-domaines)
                    </h2>
                    <Link href={route("tenants.create")}>
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Nouveau Tenant
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Gestion des Tenants" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Barre de recherche */}
                    <Card className="mb-6">
                        <CardContent className="pt-6">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-4"
                            >
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par nom de client ou domaine..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" variant="outline">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Liste des tenants */}
                    <div className="grid gap-6">
                        {tenants.data.map((tenant) => (
                            <Card key={tenant.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">
                                                {tenant.nom_client}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                ID: {tenant.id}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                href={route(
                                                    "tenants.show",
                                                    tenant.id
                                                )}
                                            >
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleDelete(tenant)
                                                }
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-700 mb-2">
                                                Domaines associés:
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {tenant.domains.map(
                                                    (domain) => (
                                                        <Badge
                                                            key={domain.id}
                                                            variant="secondary"
                                                        >
                                                            {domain.domain}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Créé le:{" "}
                                            {new Date(
                                                tenant.created_at
                                            ).toLocaleDateString("fr-FR")}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination */}
                    {tenants.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {tenants.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={
                                            link.active ? "default" : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {tenants.data.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">
                                    Aucun tenant trouvé.
                                </p>
                                <Link
                                    href={route("tenants.create")}
                                    className="mt-4 inline-block"
                                >
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Créer le premier tenant
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

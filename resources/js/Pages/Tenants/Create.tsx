import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import React from "react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nom_client: "",
        subdomain: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("tenants.store"));
    };

    const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Nettoyer le sous-domaine pour qu'il soit valide
        const value = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/^-+|-+$/g, "");
        setData("subdomain", value);
    };

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
                        Créer un nouveau tenant
                    </h2>
                </div>
            }
        >
            <Head title="Créer un tenant" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations du tenant</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nom du client */}
                                <div className="space-y-2">
                                    <Label htmlFor="nom_client">
                                        Nom du client *
                                    </Label>
                                    <Input
                                        id="nom_client"
                                        type="text"
                                        value={data.nom_client}
                                        onChange={(e) =>
                                            setData(
                                                "nom_client",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: Entreprise ABC"
                                        required
                                    />
                                    {errors.nom_client && (
                                        <p className="text-sm text-red-600">
                                            {errors.nom_client}
                                        </p>
                                    )}
                                </div>

                                {/* Sous-domaine */}
                                <div className="space-y-2">
                                    <Label htmlFor="subdomain">
                                        Sous-domaine *
                                    </Label>
                                    <div className="flex items-center">
                                        <Input
                                            id="subdomain"
                                            type="text"
                                            value={data.subdomain}
                                            onChange={handleSubdomainChange}
                                            placeholder="entreprise-abc"
                                            className="rounded-r-none"
                                            required
                                        />
                                        <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                                            .localhost
                                        </div>
                                    </div>
                                    {errors.subdomain && (
                                        <p className="text-sm text-red-600">
                                            {errors.subdomain}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Seuls les lettres minuscules, chiffres
                                        et tirets sont autorisés.
                                    </p>
                                </div>

                                {/* Aperçu du domaine */}
                                {data.subdomain && (
                                    <Alert>
                                        <AlertDescription>
                                            <strong>
                                                Domaine qui sera créé:
                                            </strong>{" "}
                                            {data.subdomain}.localhost
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Erreurs générales */}
                                {errors.error && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {errors.error}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {/* Boutons d'action */}
                                <div className="flex justify-end gap-4 pt-4">
                                    <Link href={route("tenants.index")}>
                                        <Button type="button" variant="outline">
                                            Annuler
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing
                                            ? "Création..."
                                            : "Créer le tenant"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Informations importantes */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Informations importantes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-gray-600">
                            <p>
                                • Une base de données séparée sera
                                automatiquement créée pour ce tenant
                            </p>
                            <p>
                                • Les migrations tenant seront exécutées
                                automatiquement
                            </p>
                            <p>
                                • Le sous-domaine doit être unique dans le
                                système
                            </p>
                            <p>
                                • Une fois créé, le sous-domaine ne peut pas
                                être modifié
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

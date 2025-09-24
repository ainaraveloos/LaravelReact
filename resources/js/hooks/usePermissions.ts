import type { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { useCallback } from "react";

type PermissionUser = PageProps["auth"]["user"] & {
    is_dna?: boolean;
    accepted_routes?: string[] | Record<string, any>;
    permissions?: string[] | Record<string, any>;
};

export default function usePermissions() {
    const page = usePage<PageProps>();
    const user = page.props.auth.user as PermissionUser;

    // Normaliser les routes/permissions en tableau
    const normalizeRoutes = useCallback(
        (routes?: string[] | Record<string, any>): string[] => {
            if (!routes) return [];
            if (Array.isArray(routes)) return routes;
            if (typeof routes === "object")
                return Object.values(routes).map(String);
            return [];
        },
        []
    );

    // Vérifie si l'utilisateur peut accéder à une route/permission
    const can = useCallback(
        (routeOrPermission?: string) => {
            if (!routeOrPermission) return true;
            if (user?.is_dna) return true;

            const acceptedRoutes = normalizeRoutes(user?.accepted_routes);
            const permissions = normalizeRoutes(user?.permissions);

            return (
                acceptedRoutes.includes(routeOrPermission) ||
                permissions.includes(routeOrPermission)
            );
        },
        [user, normalizeRoutes]
    );

    return { can };
}

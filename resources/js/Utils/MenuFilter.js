export function filterMenuByPrivileges(menu, privileges, isDNA) {
    if (isDNA) {
        return menu;
    }
    function hasAccess(item) {
        // Si l'item a une routeName, on vérifie l'accès direct
        if (item.routeName && privileges.includes(item.routeName)) {
            return true;
        }
        // Si l'item a des enfants, on vérifie si au moins un enfant est accessible
        if (item.children && Array.isArray(item.children)) {
            return item.children.some(hasAccess);
        }
        return false;
    }

    // recurssicve
    return menu
        .map((item) => {
            if (item.children) {
                const filteredChildren = item.children.filter(hasAccess);
                if (filteredChildren.length > 0) {
                    return { ...item, children: filteredChildren };
                }
            }
            // Si pas d'enfants, on garde l'item seulement si accessible
            if (hasAccess(item)) {
                return item;
            }
            return null;
        })
        .filter(Boolean);
}

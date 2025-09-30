export function getMenuData() {
    return [
        getItem(
            "Dashboard",
            "dashboard",
            "fa-solid fa-house",
            null,
            ["#eab308", "#ca8a04"],
            [
                getItem(
                    "dashboard1",
                    "dashboard1.index",
                    "fa-solid fa-calendar",
                    "calendrier.index"
                ),
                getItem(
                    "dashboard2",
                    "dashboard2.index",
                    "fa-solid fa-calendar",
                    "dashboard2.index"
                ),
            ]
        ),

        getItem(
            "Paramètres",
            "parametre",
            "fa-cog",
            null,
            ["#112e79", "#112e79"],
            [
                getItem(
                    "Groupes Utilisateur",
                    "user-groups",
                    "fa-solid fa-users-gear",
                    "group_user.index"
                ),
                getItem(
                    "Utilisateurs",
                    "user",
                    "fa-solid fa-user-group",
                    "user.index"
                ),
            ]
        ),
    ];
}

function getItem(label, key, icon, routeName, gradient, children = null) {
    return {
        key,
        label,
        icon,
        routeName,
        gradient,
        children: children
            ? children.map((child) => ({
                  ...child,
                  class: "menu-item-child",
              }))
            : null,
    };
}

export function findParentByChildKey(childKey) {
    const menu = getMenuData();

    for (const parent of menu) {
        if (parent.children) {
            const foundChild = parent.children.find(
                (child) => child.key === childKey
            );
            if (foundChild) {
                return parent;
            }
        }
    }

    return null; // si non trouvé
}

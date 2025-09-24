export function getMenuData() {
    return [
        getItem(
            "Tableau de Bord",
            "dashboard",
            "fa-chart-bar",
            null,
            ["#eab308", "#ca8a04"],
            [
                getItem(
                    "Calendriers",
                    "calendrier",
                    "fa-solid fa-calendar-days",
                    "calendrier.index"
                ),
                getItem(
                    "Vehicule",
                    "dashboard_vehicule",
                    "fa-solid fa-car",
                    "dashboard.vehicule"
                ),
                getItem(
                    "Voyage",
                    "dashboard_voyage",
                    "fa-solid fa-car",
                    "dashboard.voyage"
                ),
                getItem(
                    "Facturation & Comptablité",
                    "dashboard_facturation",
                    "fa-solid fa-car",
                    "dashboard.comptablite"
                ),
                getItem(
                    "Carburant",
                    "dashboard_carburant",
                    "fa-solid fa-gas",
                    "dashboard.carburant"
                ),
            ]
        ),

        getItem(
            "Facturation et Comptabilité",
            "accueil",
            "fa-file-invoice-dollar",
            null,
            ["#6b7280", "#4b5563"],
            [
                getItem(
                    "Trésoreries",
                    "tresorerie",
                    "fa-solid fa-car",
                    "tresorerie.index"
                ),
                getItem(
                    "Mouvements de Trésorerie",
                    "tresorerie_mouvement",
                    "fa-solid fa-car",
                    "tresorerie_mouvement.index"
                ),
                getItem(
                    "Flux de Trésorerie ",
                    "tresorerieflux",
                    "fa-solid fa-car",
                    "tresorerieflux.index"
                ),
                getItem(
                    "Factures Fournisseurs",
                    "article_approvisionnement",
                    "fa-solid fa-calendar-check",
                    "article_approvisionnement.index"
                ),
                getItem(
                    "Factures Clients",
                    "factureclient",
                    "fa-solid fa-calendar-check",
                    "factureclient.index"
                ),
            ]
        ),

        getItem(
            "Gestion des Clients",
            "gestion_financiere",
            "fa-users",
            null,
            ["#a855f7", "#7e22ce"],
            [
                getItem("Client", "client", "fa-solid fa-user", "client.index"),
                getItem(
                    "Dévis Client",
                    "devisclient",
                    "fa-solid fa-car",
                    "devisclient.index"
                ),
                getItem(
                    "Fournisseur",
                    "fournisseur",
                    "fa-solid fa-calendar-check",
                    "fournisseur.index"
                ),
            ]
        ),

        getItem(
            "Gestion de Garage",
            "article",
            "fa-tools",
            null,
            ["#f97316", "#ea580c"],
            [
                getItem(
                    "Article",
                    "article",
                    "fa-solid fa-calendar-check",
                    "article.index"
                ),
                getItem(
                    "Bon de Commande",
                    "article_boncommande",
                    "fa-solid fa-calendar-check",
                    "article_boncommande.index"
                ),
                getItem(
                    "Inventaire",
                    "article_inventaire",
                    "fa-solid fa-calendar-check",
                    "article_inventaire.index"
                ),
                getItem(
                    "Mouvement",
                    "article_mouvement",
                    "fa-solid fa-calendar-check",
                    "article_mouvement.index"
                ),
                getItem(
                    "Flux",
                    "article_flux",
                    "fa-solid fa-calendar-check",
                    "article_flux.index"
                ),
                getItem(
                    "Inventaire Pneu",
                    "pneu_inventaire",
                    "fa-solid fa-calendar-check",
                    "pneu_inventaire.index"
                ),
            ]
        ),

        getItem(
            "Gestion des Chauffeurs",
            "tiers",
            "fa-user-tie",
            null,
            ["#3b82f6", "#2563eb"],
            [
                getItem(
                    "Chauffeur",
                    "chauffeur",
                    "fa-solid fa-id-card",
                    "chauffeur.index"
                ),
            ]
        ),

        getItem(
            "Gestion des Voyages",
            "voyages",
            "fa-car",
            null,
            ["#3b82f6", "#2563eb"],
            [
                getItem(
                    "Liste des Réservations",
                    "reservation",
                    "fa-solid fa-calendar-check",
                    "reservation.index"
                ),
                getItem(
                    "Liste des voyages",
                    "voyage_list",
                    "fa-solid fa-calendar-check",
                    "voyages.index"
                ),
            ]
        ),

        getItem(
            "Gestion du Carburant",
            "magasin",
            "fa-gas-pump",
            null,
            ["#ec4899", "#db2777"],
            [
                getItem(
                    "Carte Carburant",
                    "carburant-cards",
                    "fa-solid fa-credit-card",
                    "carburant_cards.index"
                ),
                getItem(
                    "Transactions",
                    "carburant-transactions",
                    "fa-solid fa-credit-card",
                    "carburant_transactions.index"
                ),
                getItem(
                    "Mouvement Carburant",
                    "carburant-mouvements",
                    "fa-solid fa-check-square",
                    "carburant_mouvements.index"
                ),
            ]
        ),

        getItem(
            "Gestion de la Flotte",
            "gestion_flotte",
            "fa-car-side",
            null,
            ["#22c55e", "#16a34a"],
            [
                getItem(
                    "Véhicule",
                    "vehicule",
                    "fa-solid fa-car",
                    "vehicule.index"
                ),
                getItem(
                    "Rémorque",
                    "remorque",
                    "fa-solid fa-car",
                    "remorque.index"
                ),
                getItem(
                    "Documents Véhicule",
                    "vehiculedocument",
                    "fa-solid fa-car",
                    "vehiculedocument.index"
                ),
                getItem(
                    "Maintenance Préventif",
                    "calendar-planning",
                    "fa-solid fa-calendar-check",
                    "planning_calendar.index"
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

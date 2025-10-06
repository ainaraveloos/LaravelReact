# Guide de Configuration Stancl/Tenancy Multi-Database

## Vue d'ensemble

Cette application utilise Stancl/Tenancy pour implémenter une architecture multi-tenant avec des bases de données séparées pour chaque tenant.

## Architecture

### Application Centrale

-   **Domaine**: `testr.localhost` (configurable)
-   **Base de données**: `testr_central`
-   **Utilisateurs**: Seuls les utilisateurs avec `is_dna = true` peuvent accéder à la gestion des tenants
-   **Fonctionnalités**:
    -   Authentification des utilisateurs DNA
    -   CRUD des tenants (création, lecture, suppression - pas de mise à jour)
    -   Tableau de bord de gestion

### Tenants

-   **Domaines**: `{subdomain}.localhost`
-   **Base de données**: `tenant{tenant_id}`
-   **Utilisateurs**: Utilisateurs normaux (non-DNA) migrés depuis l'application centrale
-   **Fonctionnalités**: Toutes les fonctionnalités métier de l'application

## Configuration

### 1. Variables d'environnement

**Option A: Configuration automatique (recommandée)**

```bash
./configure-env.sh
```

**Option B: Configuration manuelle**
Ajoutez ces variables à votre fichier `.env`:

```env
# Application
APP_NAME="TestR Multi-Tenant"
APP_URL=http://testr.localhost
APP_DOMAIN=localhost

# Base de données centrale
DB_CONNECTION=central
DB_DATABASE=testr_central
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=

# Autres configurations nécessaires
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database
```

### 2. Configuration des domaines locaux

Ajoutez ces entrées à votre fichier hosts (`/etc/hosts` sur Linux/Mac, `C:\Windows\System32\drivers\etc\hosts` sur Windows):

```
127.0.0.1 testr.localhost
127.0.0.1 *.localhost
```

### 3. Configuration du serveur web

#### Avec Laragon (Windows)

1. Créez un virtual host pour `testr.localhost`
2. Configurez un wildcard pour `*.localhost`

#### Avec Valet (Mac)

```bash
valet link testr
valet domain localhost
```

### 4. Migrations

```bash
# Configurer l'environnement (si pas encore fait)
./configure-env.sh

# Migrer la base de données centrale
php artisan migrate --database=central

# Les migrations tenant seront automatiquement appliquées lors de la création des tenants
```

## Utilisation

### 1. Créer un utilisateur DNA

```bash
php artisan tinker
```

```php
$user = App\Models\User::create([
    'name' => 'Admin DNA',
    'email' => 'admin@testr.localhost',
    'password' => bcrypt('password'),
    'is_dna' => true
]);
```

### 2. Créer un tenant

1. Connectez-vous avec un utilisateur DNA sur `http://testr.localhost`
2. Accédez à la section "Tenants"
3. Créez un nouveau tenant avec un sous-domaine

### 3. Migrer des données vers un tenant

```bash
# Migrer tous les utilisateurs non-DNA vers un tenant
php artisan tenant:migrate-data {tenant_id} --all-users

# Migrer des utilisateurs spécifiques
php artisan tenant:migrate-data {tenant_id} --users=1,2,3
```

### 4. Accéder à un tenant

Une fois créé, accédez au tenant via: `http://{subdomain}.localhost`

## Structure des fichiers

### Contrôleurs

-   `app/Http/Controllers/TenantController.php` - Gestion des tenants (central)
-   Contrôleurs existants utilisés dans les deux contextes

### Modèles

-   `app/Models/Tenant.php` - Modèle tenant personnalisé
-   `app/Models/User.php` - Avec logique `is_dna`

### Vues React

-   `resources/js/Pages/Tenants/` - Interface de gestion des tenants
-   `resources/js/Pages/Tenant/Dashboard.tsx` - Dashboard des tenants

### Routes

-   `routes/web.php` - Routes de l'application centrale
-   `routes/tenant.php` - Routes des tenants

### Middleware

-   `app/Http/Middleware/EnsureDnaUser.php` - Protection des routes DNA

## Commandes utiles

```bash
# Lister tous les tenants
php artisan tenants:list

# Exécuter une commande sur tous les tenants
php artisan tenants:artisan "migrate:status"

# Exécuter une commande sur un tenant spécifique
php artisan tenants:artisan "migrate:status" --tenants=tenant_id

# Migrer les données
php artisan tenant:migrate-data tenant_id --all-users
```

## Sécurité

-   Les utilisateurs DNA ne peuvent pas être migrés vers les tenants
-   Les routes de gestion des tenants sont protégées par le middleware `dna`
-   Chaque tenant a sa propre base de données isolée
-   Les domaines centraux sont configurés pour éviter les conflits

## Dépannage

### Problème: Tenant non accessible

-   Vérifiez la configuration DNS/hosts
-   Vérifiez que la base de données tenant existe
-   Vérifiez les migrations tenant

### Problème: Erreur de permissions

-   Vérifiez que l'utilisateur a `is_dna = true`
-   Vérifiez la configuration du middleware

### Problème: Migration échoue

-   Vérifiez les permissions de base de données
-   Vérifiez que le tenant existe
-   Vérifiez les logs Laravel

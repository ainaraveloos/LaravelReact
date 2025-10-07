<?php

namespace App\Services;

use App\Models\Tenant;
use App\Repositories\TenantRepository;
use App\Services\BaseService;
use Exception;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class TenantService extends BaseService
{
    protected $repository;

    public function __construct(TenantRepository $tenantRepository)
    {
        $this->repository = $tenantRepository;
        parent::__construct($tenantRepository);
    }

    public function createTenant(array $validated)
    {
        try {
            // Création du tenant directement via le modèle
            $baseDomain = str_replace(['.', '-', ' '], '_', $validated['subdomain']);

            $tenant = new Tenant();
            $tenant->id = $baseDomain;
            $tenant->nom_client = $validated['nom_client'];
            $tenant->data = $validated['data'] ?? [];
            $tenant->save();

            if (!$tenant) {
                throw new Exception("Erreur lors de la création du tenant");
            }

            // Création du domaine
            $this->createDomain($tenant, $validated['subdomain']);

            // Initialisation de la base de données du tenant
            $this->initializeTenantDatabase($tenant);

            return $tenant;
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la création du tenant: " . $e->getMessage());
        }
    }

    private function createDomain($tenant, string $domain)
    {
        $domainSuffix = config('app.domain', 'localhost');

        if (!is_object($tenant) || !method_exists($tenant, 'domains')) {
            throw new Exception("Invalid tenant object or domains relationship not defined");
        }

        $tenant->domains()->create([
            'domain' => $domain . '.' . $domainSuffix
        ]);
    }

    private function initializeTenantDatabase($tenant)
    {
        Artisan::call('tenants:seed', [
            '--tenants' => [$tenant->getTenantKey()],
        ]);
    }


    public function setTenantStatus(Tenant $tenant)
    {
        try {

            //  DB::beginTransaction();
            $isActive = $tenant->is_active == 1 ? 0 : 1;
            $tenant->update(['is_active' => $isActive]);
            // DB::commit();

            $message = $isActive > 0 ? 'Locataire activé avec succès.' : 'Locataire désactivé avec succès.';
            return $this->successResponse($message);
        } catch (Exception $e) {
            //if (DB::transactionLevel() > 0) {
            //  DB::rollBack();
            //  }
            return $this->errorResponse('Une erreur est survenue lors de la mise à jour du statut du locataire.', $e);
        }
    }

    /**
     * Supprimer un tenant et sa base de données
     */
    public function deleteTenant(Tenant $tenant): bool
    {
        try {
            // Supprimer les domaines associés
            $tenant->domains()->delete();

            // Supprimer le tenant (cela déclenchera automatiquement la suppression de la DB)
            return $tenant->delete();
        } catch (Exception $e) {
            throw new Exception("Erreur lors de la suppression du tenant: " . $e->getMessage());
        }
    }

    /**
     * Migrer les données existantes vers un tenant
     */
    public function migrateDataToTenant(Tenant $tenant, array $userIds = []): void
    {
        // Initialiser le contexte tenant
        tenancy()->initialize($tenant);

        try {
            // Migrer les utilisateurs sélectionnés
            if (!empty($userIds)) {
                $users = \App\Models\User::on('central')
                    ->whereIn('id', $userIds)
                    ->where('is_dna', false) // Exclure les utilisateurs DNA
                    ->get();

                foreach ($users as $user) {
                    // Créer l'utilisateur dans la base tenant
                    \App\Models\User::create([
                        'name' => $user->name,
                        'email' => $user->email,
                        'password' => $user->password,
                        'user_group_id' => $user->user_group_id,
                        'photo' => $user->photo,
                        'is_dna' => false,
                        'email_verified_at' => $user->email_verified_at,
                    ]);
                }
            }

            // Migrer les groupes d'utilisateurs
            $userGroups = \App\Models\UserGroup::on('central')->get();
            foreach ($userGroups as $group) {
                \App\Models\UserGroup::create([
                    'name' => $group->name,
                    'privileges' => $group->privileges,
                ]);
            }

        } finally {
            // Terminer le contexte tenant
            tenancy()->end();
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Services\TenantService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stancl\Tenancy\Database\Models\Domain;

class TenantController extends Controller
{
    protected $tenantService;

    public function __construct(TenantService $tenantService)
    {
        $this->tenantService = $tenantService;
    }

    /**
     * Afficher la liste des tenants (sous-domaines)
     */
    public function index(Request $request)
    {
        $tenants = Tenant::with('domains')
            ->filter()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tenants/Index', [
            'tenants' => $tenants,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Afficher le formulaire de création d'un tenant
     */
    public function create()
    {
        return Inertia::render('Tenants/Create');
    }

    /**
     * Créer un nouveau tenant
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_client' => 'required|string|max:255',
            'subdomain' => 'required|string|max:63|regex:/^[a-z0-9-]+$/|unique:domains,domain',
            'data' => 'nullable|array'
        ]);

        try {
            $tenant = $this->tenantService->createTenant($validated);

            return redirect()
                ->route('tenants.index')
                ->with('success', 'Tenant créé avec succès.');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Erreur lors de la création du tenant: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Afficher les détails d'un tenant
     */
    public function show(Tenant $tenant)
    {
        $tenant->load('domains');

        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant
        ]);
    }

    /**
     * Supprimer un tenant
     */
    public function destroy(Tenant $tenant)
    {
        try {
            $this->tenantService->deleteTenant($tenant);

            return redirect()
                ->route('tenants.index')
                ->with('success', 'Tenant supprimé avec succès.');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Erreur lors de la suppression du tenant: ' . $e->getMessage()]);
        }
    }
}

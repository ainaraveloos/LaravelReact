<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Http\Request;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;


class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasFactory, HasDatabase, HasDomains;
    protected $fillable = [
        'id',

        'nom_client',
        'data',
    ];
    protected $casts = [
        'data' => 'array',
    ];
    protected $appends = ['nom_domaine'];
    public function scopeFilter($query)
    {
        $request = resolve(Request::class);
        if(isset($request->search)){
            $search = $request->search;
            $query->where('id', 'LIKE', "%$search%");
        }
        return $query;
    }

    /**
     * Récupère tous les tenants en ajoutant la valeur effective de is_active,
     * c'est-à-dire la valeur dans la colonne physique ou dans data['is_active'].
     */
    public static function getAllWithIsActive()
    {
        $tenants = self::all();

        // Parcours et corrige la valeur is_active pour chaque tenant
        $tenants->transform(function ($tenant) {
            // Si is_active dans la colonne est null, prend la valeur dans data (si existante)
            if (is_null($tenant->is_active) && isset($tenant->data['is_active'])) {
                $tenant->is_active_effective = (bool) $tenant->data['is_active'];
            } else {
                $tenant->is_active_effective = (bool) $tenant->is_active;
            }
            return $tenant;
        });

        return $tenants;
    }

    public function getNomDomaineAttribute()
    {
        $baseDomain = $this->domains()->first()->domain ?? null;
        return $baseDomain;
    }

}

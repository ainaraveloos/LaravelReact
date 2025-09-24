<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'is_you',
        'privileges_name',
        'group_user_name',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_dna' => 'boolean'
        ];
    }

    public function scopeFilter($query, $search = null)
    {
        if (!is_null($search)){
            $query->where(function ($q) use ($search) {
                $q->where('users.name', 'LIKE', "%{$search}%")
                    ->orWhere('users.email', 'LIKE', "%{$search}%");
            })
                ->leftJoin('user_groups', 'users.user_group_id', '=', 'user_groups.id')
                ->orWhere('user_groups.name', 'LIKE', "%{$search}%")
                ->select('users.*');
        }
        return $query;
    }


    public function group()
    {
        return $this->belongsTo(UserGroup::class, 'user_group_id');
    }
    public function getGroupUserNameAttribute()
    {
        return $this->group->name;
    }

    public function scopeIsdna($query)
    {
        return $query->where('is_dna', false);

    }

    public function getIsYouAttribute()
    {
        return $this->id == Auth::id();
    }

    public function getPrivilegesNameAttribute()
    {
        if ($this->is_dna) {
            return "DNA";
        }
        return $this->group?->name ?? "";
    }


    public function getPrivilegesAttribute()
    {
        // Si c'est DNA, retourner tous les privilèges
        if ($this->is_dna) {
            return $this->getAllPrivilegeKeys();
        }

        return $this->group?->privileges ?? [];
    }

    /**
     * Récupérer toutes les clés de privilèges disponibles
     */
    private function getAllPrivilegeKeys(): array
    {
        $keys = [];
        $this->extractAllKeys(UserGroup::$privileges, $keys);
        return array_unique($keys);
    }

    /**
     * Extraire récursivement toutes les clés de privilèges
     */
    private function extractAllKeys($privileges, &$keys)
    {
        foreach ($privileges as $privilege) {
            $keys[] = $privilege['key'];

            if (isset($privilege['children'])) {
                $this->extractAllKeys($privilege['children'], $keys);
            }
        }
    }

    /**
     * Récupérer toutes les routes disponibles
     */
    private function getAllRoutes(): array
    {
        $routes = [];
        $this->extractAllRoutes(UserGroup::$privileges, $routes);
        return array_unique($routes);
    }

    /**
     * Extraire récursivement toutes les routes
     */
    private function extractAllRoutes($privileges, &$routes)
    {
        foreach ($privileges as $privilege) {
            if (isset($privilege['routes']) && $privilege['routes']) {
                array_push($routes, ...$privilege['routes']);
            }

            if (isset($privilege['children'])) {
                $this->extractAllRoutes($privilege['children'], $routes);
            }
        }
    }

    public function getAcceptedRoutesAttribute()
    {
        // Si c'est DNA, retourner toutes les routes
        if ($this->is_dna) {
            return $this->getAllRoutes();
        }

        return $this->extractAcceptedRoutes(UserGroup::$privileges, $this->privileges);
    }

    /**
     * Vérifier si l'utilisateur est DNA
     */
    public function isDNA(): bool
    {
        return $this->is_dna === true;
    }

    private function extractAcceptedRoutes($sources, $privileges)
    {
        $routes = [];
        foreach ($sources as $privilege) {
            if (in_array($privilege['key'], $privileges))
                if (isset($privilege['routes']) && $privilege['routes'])
                    array_push($routes, ...$privilege['routes']);

            if (isset($privilege['children']))
                array_push($routes, ...$this->extractAcceptedRoutes($privilege['children'], $privileges));
        }

        return array_unique($routes);
    }

}

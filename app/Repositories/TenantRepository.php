<?php

namespace App\Repositories;

use App\Models\Tenant;

class TenantRepository extends BaseRepository
{
    public function __construct(Tenant $tenant)
    {
        parent::__construct($tenant);
    }
}

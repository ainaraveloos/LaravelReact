<?php

namespace App\Repositories;

use App\Models\UserGroup;

class UserGroupRepository extends BaseRepository
{
    public function __construct(UserGroup $userGroup)
    {
        parent::__construct($userGroup);
    }
}

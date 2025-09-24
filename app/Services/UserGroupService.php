<?php

namespace App\Services;

use App\Repositories\UserGroupRepository;
use App\Services\BaseService;

class UserGroupService extends BaseService
{
    protected $repository;

    public function __construct(UserGroupRepository $userGroupRepository)
    {
        $this->repository = $userGroupRepository;
        parent::__construct($userGroupRepository);
    }

    // Your service methods go here
    protected function initializeFilters(): void
    {
        $this->setFilterValue('id')
            ->setFilterLabel('name');
    }
}

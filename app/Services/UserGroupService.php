<?php

namespace App\Services;

use App\Repositories\UserGroupRepository;
use App\Services\BaseService;

class UserGroupService extends BaseService
{
    protected $repository;
    protected array $scope = ['filter' => 'search'];

    public function __construct(UserGroupRepository $userGroupRepository)
    {
        $this->repository = $userGroupRepository;
        parent::__construct($userGroupRepository);
    }

    // Your service methods go here
    public function initializeFilters(): void
    {
        $this->setFilterValue('id')->setFilterLabel('name');
    }
}

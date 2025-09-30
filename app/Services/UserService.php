<?php

namespace App\Services;

use App\Repositories\UserRepository;
use App\Services\BaseService;

class UserService extends BaseService
{
    protected $repository;
    protected array $relation = ['group'];
    protected array $scope = ['filter' => 'search', 'usergroup'=>'user_group_id'];

    public function __construct(UserRepository $userRepository)
    {
        $this->repository = $userRepository;
        parent::__construct($userRepository);
    }
    protected function initializeFilters(): void
    {
        $this->setFilterValue('id')->setFilterLabel('name');
    }
    public function find($id)
    {
        return $this->repository->getModel()->with($this->relation)->findOrFail($id);
    }

    public function fetchUsuer($filter)
    {
        $filter['isdna'] = 0; // On ajoute le filtre pour exclure les utilisateurs DNA

        // On vérifie si le filtre est un tableau, sinon on le transforme en tableau
        // On utilise la méthode fetchData de la repository pour récupérer les données
        $this->repository->fetchData(
            $this->relation,
            $filter,
            $this->scope,
            $this->filterValue,
            $this->filterLabel
        );
        return parent::getAll($filter);
    }
}

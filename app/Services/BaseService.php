<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseService
{
    protected string $filterValue = 'id';
    protected string $filterLabel = 'title';

    protected array $relation = [];

    protected array $scope = ['filter' => 'search'];

    protected array $filters = ['filter' => 'search'];
    protected $repository;

    public function __construct($repository)
    {
        $this->repository = $repository;
        $this->initializeFilters();
    }

    /**
     * Méthode abstraite pour initialiser les filtres spécifiques au service
     */
    protected function initializeFilters(): void
    {
        $this->setFilterLabel('id')->setFilterValue('id');
    }

    /**
     * Récupère tous les éléments selon les filtres
     *
     * @param array $filters
     * @return mixed
     */
    public function getAll(array $filters = [])
    {
        $relation = $this->relation;
        $scope = $this->scope;
        return $this->repository->fetchData($relation, $filters, $scope, $this->filterValue, $this->filterLabel);
    }

    public function countElement(array $filters = [])
    {
        $relation = $this->relation;
        $scope = $this->scope;
        return $this->repository->count($relation, $filters, $scope);
    }

    /**
     * Change la clé de filtrage (ex: champ de tri ou recherche)
     *
     * @param string $value
     * @return self
     */
    public function setFilterValue(string $value): self
    {
        $this->filterValue = $value;
        return $this;
    }

    /**
     * Change le libellé associé au filtre
     *
     * @param string $label
     * @return self
     */
    public function setFilterLabel(string $label): self
    {
        $this->filterLabel = $label;
        return $this;
    }

    /**
     * Crée un nouvel élément (sans gestion d'image)
     */
    public function create(array $validated): array
    {
        DB::beginTransaction();

        try {
            $element = $this->repository->create($validated);

            DB::commit();
            Log::info('insertion terminé', ['element' => $element->toArray()]);
            return $this->successResponse('Insertion terminée avec succès', $element);
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('erreur' . $e->getMessage(), ['exception' => $e]);
            return $this->errorResponse('Erreur lors de l\'enregistrement', $e);
        }
    }



    /**
     * Met à jour un élément existant (sans gestion d'image)
     */
    public function update($model, array $validated): array
    {
        DB::beginTransaction();

        try {
            $this->repository->update($model, $validated);
            DB::commit();

            return $this->successResponse('Mise à jour effectuée avec succès', $model);
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Erreur lors de la mise à jour', $e);
        }
    }

    public function delete($model)
    {
        DB::beginTransaction();

        try {
            $this->repository->delete($model);
            DB::commit();

            return $this->successResponse('Suppression effectuée avec succès');
        } catch (Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Erreur lors de la mise à jour', $e);
        }
    }


    protected function successResponse(string $message, object|array $data = null): array
    {
        return ['error' => false, 'message' => $message, 'element' => $data];
    }

    protected function errorResponse(string $message, Exception $e): array
    {
        return ['error' => true, 'message' => $message . ': ' . $e->getMessage()];
    }
}

<?php

namespace App\Repositories;


use App\Interfaces\CrudInterface;
use App\Utils\BaseQueryTemplate;
use Illuminate\Database\Eloquent\Model;

class BaseRepository implements CrudInterface
{
    protected Model $model;
    protected string $orderByColumn = 'id'; // Valeur par défaut
    protected string $orderByDirection = 'asc'; // Valeur par défaut


    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function fetchData(array $relations = [], array $filters = [], array $scopes = [], string $value = 'id', string $label = '', ?callable $customQuery = null, array $dataOrderBy = []): mixed
    {
        $query = $this->model->newQuery();
        // si existe des relations
        if (!empty($relations)) {
            $query->with($relations);
        }
        $query = BaseQueryTemplate::apply($query, $filters, $scopes);

        // Appliquer l'ordre par défaut
        $this->applyOrderBy($query, $dataOrderBy);

        // si il y a subrequette
        if ($customQuery) {
            $customQuery($query, $filters);
        }
        // si il y des pagination alors en retour le le pagination
        if (isset($filters['per_page']) && $filters['per_page']) {

            return $query->paginate($filters['per_page'], ['*'], 'page', $filters['current_page']);
        }

        $results = $query->get();
        if ($label) {
            $results = $results->map(function ($item) use ($value, $label) {
                if (method_exists($item, 'toValueTextArray')) {
                    return $item->toValueTextArray($value, $label);
                }
                // Fallback: map to generic { value, label } using provided fields
                $val = data_get($item, $value);
                $lab = data_get($item, $label);
                return ['value' => $val, 'label' => $lab];
            });
        }
        return $results;
    }

    protected function applyOrderBy($query, array $dataOrderBy = [])
    {
        $orderBy = $dataOrderBy['order_by'] ?? $this->orderByColumn;
        $orderDirection = $dataOrderBy['order_direction'] ?? $this->orderByDirection;

        $orderDirection = in_array(strtolower($orderDirection), ['asc', 'desc']) ? strtolower($orderDirection) : 'asc';
        if ($orderBy) {
            $query->orderBy($orderBy, $orderDirection);
        }
    }

    /**
     * Count the number of records based on filters and scopes.
     * @param array $relations
     * @param array $filters
     * @param array $scopes
     * @return int
     */
    public function count(array $relations = [], array $filters = [], array $scopes = []): int
    {
        $query = $this->model->newQuery();
        if (!empty($relations)) {
            $query->with($relations);
        }
        $query = BaseQueryTemplate::apply($query, $filters, $scopes);
        return $query->count();
    }


    /**
     * @param array $data
     * @return mixed
     */
    public function fetchAll(array $data = [], string $value = "id", string $label = ''): mixed
    {
        $query = $this->model->newQuery()->filter();
        $perPage = $data['per_page'] ?? null;
        $current_page = $data['current_page'] ?? null;

        if ($perPage) {
            return $query->paginate($perPage, ['*'], 'page', $current_page);
        } else {
            $results = $query->get();

            return $results->map(function ($item) use ($value, $label) {
                return method_exists($item, 'toValueTextArray')
                    ? $item->toValueTextArray($value, $label) : $item;
            });
        }
    }

    /**
     * @param $model
     * @param array $data
     * @return mixed
     */
    public function update($model, array $data): bool
    {
        return $model->update($data);
    }

    /**
     * @param array $data
     * @return mixed
     */
    public function create(array $data): mixed
    {
        return $this->model->create($data);
    }

    /**
     * @param $model
     * @return mixed
     */
    public function delete($model): mixed
    {
        return $model->delete();
    }

    public function get(array $critere)
    {
        return $this->model->where($critere)->get();
    }

    public function findElement(array $critere)
    {
        return $this->model->where($critere)->first();
    }

    public function setDefaultOrder(string $column, string $direction = 'asc'): self
    {
        $this->orderByColumn = $column;
        $this->orderByDirection = in_array(strtolower($direction), ['asc', 'desc']) ? $direction : 'asc';
        return $this;
    }
}

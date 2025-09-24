<?php

namespace App\Interfaces;

interface CrudInterface
{
    public function fetchData(array $relations = [], array $filters = [], array $scopes = [], string $value = 'id', string $label = '', ?callable $customQuery = null, array $dataOrderBy = []): mixed;

    public function count(array $relations = [], array $filters = [], array $scopes = []): int;

    public function fetchAll(array $data = [], string $value = 'id', string $label = ''): mixed;

    public function update($model, array $data): bool;

    public function create(array $data): mixed;

    public function delete($model): mixed;

    public function get(array $critere);

    public function findElement(array $critere);

    public function setDefaultOrder(string $column, string $direction = 'asc'): self;
}



<?php

namespace App\Interfaces;

interface CrudInterface
{
    public function create(array $data): mixed;

    public function delete($model);
}

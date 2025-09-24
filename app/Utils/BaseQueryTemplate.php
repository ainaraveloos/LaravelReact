<?php

namespace App\Utils;

use Illuminate\Database\Eloquent\Builder;

class BaseQueryTemplate
{
    /**
     * @param Builder $query
     * @param array $filter
     * @param array $filterScope
     * @return Builder
     */
    public static function apply(Builder $query, array $filter, array $filterScope = []): Builder
    {

        foreach ($filterScope as $scope => $key){
            if (array_key_exists($key, $filter) ){

                $query->{$scope}($filter[$key]);
            }
        }
        return  $query;
    }
}

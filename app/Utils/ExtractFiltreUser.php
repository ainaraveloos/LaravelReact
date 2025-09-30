<?php

namespace App\Utils;
use Illuminate\Http\Request;
class ExtractFiltreUser extends ExtractFiltre
{
    public static function extractFilter(Request $request)
    {

        $baseFilters = parent::extractFilter($request);
        $vehiculeFilters = [
            'user_group_id' => $request->input('user_group_id'),
        ];
        $vehiculeFilters = array_filter($vehiculeFilters);

        return array_merge($baseFilters, $vehiculeFilters);

    }
}

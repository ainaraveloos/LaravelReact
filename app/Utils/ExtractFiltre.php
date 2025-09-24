<?php

namespace App\Utils;

use Illuminate\Http\Request;

class ExtractFiltre
{
    public static function extractFilter(Request $request)
    {
        $perPage = config("app.pagination.per_page");
        $search = $request->input('search', '');
        $current_page = $request->input('page', 1);

        return [
            'per_page' => $perPage,
            'search' => $search,
            'current_page' => $current_page
        ];
    }
}

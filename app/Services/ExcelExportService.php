<?php

namespace App\Services;

use App\Exports\GenericQueryExport;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;

class ExcelExportService
{
    /**
     * Download an Excel file from an Eloquent query and a header->field map.
     *
     * Example map:
     * [
     *   "Nom" => 'name',
     *   "Email" => 'email',
     *   "Groupe d\'utilisateur" => 'group.name',
     * ]
     */
    public function downloadFromQuery(Builder $query, array $headerToFieldMap, string $filenameBase = 'export')
    {
        $export = new GenericQueryExport($query, $headerToFieldMap);
        $filename = $filenameBase . '_' . date('Ymd_His') . '.xlsx';
        return Excel::download($export, $filename);
    }
}



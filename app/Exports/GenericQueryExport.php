<?php

namespace App\Exports;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class GenericQueryExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize, WithChunkReading
{
    /**
     * @var Builder
     */
    protected $query;

    /**
     * @var array<string, string|Closure>
     */
    protected array $headerToFieldMap;

    /**
     * @param Builder $query Already configured query with necessary eager loads
     * @param array<string, string|Closure> $headerToFieldMap Header => field path or Closure(Model $row): mixed
     */
    public function __construct(Builder $query, array $headerToFieldMap)
    {
        $this->query = $query;
        $this->headerToFieldMap = $headerToFieldMap;
    }

    public function query()
    {
        return $this->query;
    }

    public function headings(): array
    {
        return array_keys($this->headerToFieldMap);
    }

    /**
     * @param Model $row
     */
    public function map($row): array
    {
        $line = [];
        foreach ($this->headerToFieldMap as $field) {
            $line[] = $this->resolveValue($row, $field);
        }
        return $line;
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    /**
     * @param Model $row
     * @param string|Closure $field
     */
    protected function resolveValue(Model $row, $field): string
    {
        if ($field instanceof Closure) {
            $value = $field($row);
        } else {
            $value = data_get($row, $field);
        }

        if (is_bool($value)) {
            return $value ? 'Oui' : 'Non';
        }
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d H:i:s');
        }
        if (is_array($value)) {
            return json_encode($value, JSON_UNESCAPED_UNICODE);
        }
        return (string) ($value ?? '');
    }
}



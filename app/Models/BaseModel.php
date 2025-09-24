<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Basemodel extends Model
{
    use SoftDeletes;
    protected $guarded = ["id", "create_at", "update_at", "delete_at"];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
    }
}

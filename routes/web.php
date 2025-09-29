<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserGroupController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/menu', function () {
    return Inertia::render('Menu/Index');
})->middleware(['auth', 'verified'])->name('menu');

Route::get('/test-image-upload', function () {
    return Inertia::render('TestImageUpload');
})->name('test.image.upload');

Route::middleware('auth')->group(function () {
    Route::resource("user", UserController::class);
    Route::resource("group_user", UserGroupController::class);







    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';

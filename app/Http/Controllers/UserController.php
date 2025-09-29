<?php

namespace App\Http\Controllers;


use App\Models\User;
use App\Services\UserGroupService;
use App\Services\UserService;
use App\Utils\ExtractFiltre;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;


class UserController extends Controller
{

    private $service;
    private UserGroupService $usergroupService;

    public function __construct(UserService $userService, UserGroupService $userGroupService)
    {
        $this->usergroupService = $userGroupService;
        $this->service = $userService;
    }

    public function index(Request $request)
    {
        $filtre = ExtractFiltre::extractFilter($request);
        $output = $this->service->fetchUsuer($filtre);
        $user_groupes = $this->usergroupService->getAll();
        return Inertia::render("User/Index", [
            'data' => $output,
            'user_groupes' => $user_groupes,
            "filters" => [],
            "flash" => session('flash', [])
        ]);
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email',
            'tel' => 'nullable|string|max:255',
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'user_group_id' => 'required|exists:user_groups,id',
        ]);

        if (!array_key_exists('password', $data) || empty($data['password'])) {
            $data['password'] = Hash::make('password'); // Mot de passe par défaut
        } else {
            $data['password'] = Hash::make($data['password']); // Hacher le mot de passe fourni
        }
        $data['email_verified_at'] = date("Y-m-d H:i:s");

        $this->service->create($data);

        return back()->with("message.success", "Enrégistrement effectuer");
    }
    public function show(User $user)
    {
        return back()->with([
            'flash' =>
                [
                    'user' => $user
                ]
        ]);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => "required|string|lowercase|email|max:255|unique:users,email,{$user->id}",
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'user_group_id' => 'required|exists:user_groups,id',
        ]);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return back()->with("message.success", "Enrégistrement effectuer");
    }

    public function destroy(User $user)
    {
        if (User::query()->count() <= 1 || $user->is_you)
            return back()->with("message.error", "Impossible de supprimer cet utilisateur");

        $output = $this->service->delete($user);
        if (!empty($output['error'])) {
            return back()->with('message.error', $output['message']);
        }
        return back()->with('message.success', $output['message']);
    }
}

<?php

namespace App\Http\Controllers;


use App\Models\UserGroup;
use App\Services\ExcelExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Utils\ExtractFiltre;
use App\Services\UserGroupService;

class UserGroupController extends Controller
{
    private $service;
    private ExcelExportService $excelExportService;

    public function __construct(UserGroupService $userGroupService,ExcelExportService $excelExportService)
    {
        $this->service = $userGroupService;
        $this->excelExportService = $excelExportService;
    }

    public function index(Request $request)
    {
        $filtre = ExtractFiltre::extractFilter($request);
        $output = $this->service->getAll($filtre);

        return Inertia::render('UserGroup/Index', [
            'data' => $output,
            'privilege' => UserGroup::$privileges,
            "filters" => [
                "search" => $request->search
            ],
            'flash' => session('flash', [])
        ]);
    }
    public function create()
    {
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|unique:user_groups,name',
            'description' => 'nullable|string',
            'privileges' => 'present|array',
            'privileges.*' => ''
        ]);

        $data['privileges'] = array_unique($data['privileges']);
        $output = $this->service->create($data);

        return redirect()->route('group_user.index')->with(
            $output['error'] ? 'message.error' : 'message.success',
            $output['message']
        );
    }
    public function show(int $userGroupId)
    {
        $userGroup = UserGroup::find($userGroupId);
        return back()->with([
            'flash' =>
                ['usergroup' => $userGroup]
        ]);
    }

    public function edit(string $id)
    {
    }

    public function update(Request $request, int $userGroupID)
    {
        $data = $request->validate([
            'name' => 'required|unique:user_groups,name,' . $userGroupID,
            'privileges' => 'present|array',
            'privileges.*' => ''
        ]);

        $data['privileges'] = array_unique($data['privileges']);
        $userGroup = UserGroup::find($userGroupID);
        $output = $this->service->update($userGroup, $data);

        return redirect()->route('group_user.index')->with(
            $output['error'] ? 'message.error' : 'message.success',
            $output['message']
        );
    }

    // public function show(int $userGroupId)
    // {
    //     // Fetch the single user group
    //     $selectedgroup = UserGroup::find($userGroupId);

    //     return Inertia::render('UserGroup/ListeGroup', [
    //         'selectedgroup' => $selectedgroup,
    //         'data' => $this->service->getAll([]),
    //         'privilege' => UserGroup::$privileges,
    //         "filters" => [
    //             "search" => request('search')
    //         ],
    //     ]);
    // }

    public function destroy(int $userGroupId)
    {
        $userGroup = UserGroup::find($userGroupId);

        if (!$userGroup) {
            return redirect()->route('group_user.index')->with('message.error', 'Groupe introuvable');
        }

        if ($userGroup->users()->exists()) {
            return redirect()->route('group_user.index')->with('message.error', 'Ce groupe contient encore des utilisateurs. Veuillez les dissocier avant de supprimer.');
        }

        try {
            $output = $this->service->delete($userGroup);

            return redirect()->route('group_user.index')->with(
                $output['error'] ? 'message.error' : 'message.success',
                $output['message']
            );

        } catch (\Exception $e) {
            return redirect()->route('group_user.index')->with('message.error', 'Une erreur est survenue lors de la suppression');
        }
    }
    public function exportExcel(Request $request)
    {
        // expected payload via POST form: map[0][header], map[0][field], ...
        $data = $request->validate([
            'map' => 'required|array|min:1',
            'map.*.header' => 'required|string',
            'map.*.field' => 'required|string',
        ]);

        $map = [];
        foreach ($data['map'] as $item) {
            $map[$item['header']] = $item['field'];
        }

        $query = UserGroup::query();
        return $this->excelExportService->downloadFromQuery($query, $map, 'usergroups');
    }


}

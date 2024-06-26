<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rules;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('User/Index');
    }

    public function apiGetUsers()
    {
        $usersDefault = User::with('roles')->latest()->get();
        $rolesDefault = Role::all();
        $usersDefault = $usersDefault->map(function ($user) {
            $role = $user->roles->first();
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'number' => $user->number,
                'role' => $role->name,
                'role_id' => $role->id,
                'created_at' => $user->created_at
            ];
        });

        return response()->json([
            'users' => $usersDefault,
            'roles' => $rolesDefault
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'number' => $request->number ? $request->number : null,
            'password' => Hash::make($request->password),
        ]);
        $user->assignRole($request->role["name"]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::with('roles')->findOrFail($id);
        if ($request->new_password) {
            $user->update(['password' => Hash::make($request->new_password)]);
        }
        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'number' => $request->number ? $request->number : null,
        ]);
        $user->syncRoles($request->role);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::find($id)->delete();
    }
}

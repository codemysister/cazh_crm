<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // Super Admin
        $super_admin = User::create([
            "name" => "Super Admin",
            "email" => "super_admin@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("admin123")
        ]);

        $super_admin->assignRole("super admin");

        // CEO
        $ceo = User::create([
            "name" => "Muh Arif Mahfudin",
            "email" => "ceo@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("ceo123")
        ]);

        $ceo->assignRole("ceo");

        // AE
        for ($i = 1; $i <= 5; $i++) {
            $sales = User::create([
                "name" => "Account Executive $i",
                "email" => "account_executive$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("ae123")
            ]);

            $sales->assignRole("account executive");
        }

        // Account Manager
        for ($i = 1; $i <= 5; $i++) {
            $am = User::create([
                "name" => "Account Manager $i",
                "email" => "account_manager$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("am123")
            ]);

            $am->assignRole("account manager");
        }

        // Account Representative
        for ($i = 1; $i <= 2; $i++) {
            $am = User::create([
                "name" => "Account Representative $i",
                "email" => "account_representative$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("ar123")
            ]);

            $am->assignRole("account representative");
        }


        // Admin
        $admin = User::create([
            "name" => "Admin",
            "email" => "admin@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("admin123")
        ]);

        $admin->assignRole("general admin");

        // DPD
        $designer = User::create([
            "name" => "Graphics Designer",
            "email" => "graphic_designer@gmail.com",
            "number" => "085178612434",
            "password" => bcrypt("designer123")
        ]);
        $designer->assignRole("graphics designer");

        // Referral
        for ($i = 1; $i <= 5; $i++) {
            $referral = User::create([
                "name" => "Referral $i",
                "email" => "referral$i@gmail.com",
                "number" => "085178612434",
                "password" => bcrypt("referral123")
            ]);

            $referral->assignRole("referral");
        }

    }
}

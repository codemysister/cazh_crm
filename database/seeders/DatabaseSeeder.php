<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Status;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleSeeder::class);
        $this->call(PermissionSeeder::class);
        $this->call(RolePermissionSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(ProductSeeder::class);
        $this->call(StatusSeeder::class);
        // $this->call(PartnerSeeder::class);
        // $this->call(PartnerPicSeeder::class);
        // $this->call(PartnerBankSeeder::class);
        // $this->call(PartnerAccountSeeder::class);
        // $this->call(PartnerSubscriptionSeeder::class);
        // $this->call(PartnerPriceListSeeder::class);
        // $this->call(SignatureSeeder::class);
    }
}

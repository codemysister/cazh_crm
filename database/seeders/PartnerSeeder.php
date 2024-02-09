<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PartnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            DB::table('partners')->insert([
                'uuid' => \Illuminate\Support\Str::uuid(),
                'sales_id' => 2,
                'account_manager_id' => 7,
                'name' => 'Partner ' . $i,
                'phone_number' => '08512783612',
                'province' => json_encode(['code' => '33', 'name' => 'Jawa Tengah']),
                'regency' => json_encode(['code' => '02', 'name' => 'Kab. Banyumas']),
                'subdistrict' => \json_encode(['code' => '3302740', 'name' => 'Purwokerto Utara']),
                'address' => 'Address ' . $i,
                'onboarding_date' => now(),
                'live_date' => now(),
                'status' => 'Aktif',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

        }
    }
}

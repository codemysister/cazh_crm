<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('partner_pic', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');
            $table->foreignId('partner_id')->constrained('partners', 'id')->onDelete('cascade');
            $table->string('name');
            $table->string('number');
            $table->string('position');
            $table->text('address');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partner_p_i_c_s');
    }
};

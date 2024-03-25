<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class Partner extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $guarded = [];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id', 'id');
    }
    public function referral()
    {
        return $this->belongsTo(User::class, 'referral_id', 'id');
    }
    public function account_manager()
    {
        return $this->belongsTo(User::class, 'account_manager_id', 'id');
    }

    public function pics()
    {
        return $this->hasMany(PartnerPIC::class, 'partner_id', 'id');
    }

    public function banks()
    {
        return $this->hasMany(PartnerBank::class, 'partner_id', 'id');
    }

    public function accounts()
    {
        return $this->hasMany(PartnerAccountSetting::class, 'partner_id', 'id');
    }

    public function subscriptions()
    {
        return $this->hasMany(PartnerSubscription::class);
    }

    public function price_list()
    {
        return $this->hasOne(PartnerPriceList::class);
    }

    public function sph()
    {
        return $this->hasOne(SPH::class, 'partner_id', 'id');
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function invoice_generals()
    {
        return $this->hasMany(InvoiceGeneral::class);
    }
    public function invoice_subscriptions()
    {
        return $this->hasMany(InvoiceSubscription::class);
    }
}

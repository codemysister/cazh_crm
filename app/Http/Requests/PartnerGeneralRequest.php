<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PartnerGeneralRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'partner.name' => 'required|string|max:255',
            'partner.logo' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
            'partner.province' => 'required',
            'partner.regency' => 'required',
            // 'partner.phone_number' => 'required|string|max:20',
            // 'partner.subdistrict' => 'required',
            // 'partner.address' => 'nullable|string',
            // 'partner.onboarding_date' => 'required|date',
            // 'partner.onboarding_age' => 'nullable|integer',
            // 'partner.live_date' => 'nullable|date',
            // 'partner.live_age' => 'nullable|integer',
            // 'partner.monitoring_date_after_3_month_live' => 'nullable|date',
            'partner.status' => 'required',
            'partner.payment_metode' => 'required',
            'partner.period' => 'required',

            // 'pic.name' => 'required|string|max:255',
            // 'pic.number' => 'required|string|max:20',
            // 'pic.position' => 'required|string|max:255',
            // 'pic.email' => 'required|email|max:255',

            // 'bank.bank' => 'required|string',
            // 'bank.account_bank_number' => 'required|string',
            // 'bank.account_bank_name' => 'required|string',

            // 'subscription.bill' => 'required',
            // 'subscription.nominal' => 'required|numeric',
            // 'subscription.ppn' => 'required|numeric',
            // 'subscription.total_ppn' => 'required|numeric',
            // 'subscription.total_bill' => 'required|numeric',

            // 'price_list.price_card' => 'required',
            // 'price_list.price_training_online' => 'nullable|numeric',
            // 'price_list.price_training_offline' => 'nullable|numeric',
            // 'price_list.price_lanyard' => 'nullable|numeric',
            // 'price_list.price_subscription_system' => 'nullable|numeric',
            // 'price_list.fee_purchase_cazhpoin' => 'nullable|numeric',
            // 'price_list.fee_bill_cazhpoin' => 'nullable|numeric',
            // 'price_list.fee_topup_cazhpos' => 'nullable|numeric',
            // 'price_list.fee_withdraw_cazhpos' => 'nullable|numeric',
            // 'price_list.fee_bill_saldokartu' => 'nullable|numeric',
        ];


    }

    public function messages(): array
    {
        return [
            'partner.name.required' => 'Nama lembaga harus diiisi',
            'partner.status.required' => 'Status lembaga harus diiisi',
            'partner.payment_metode.required' => 'Metode pembayaran lembaga harus diiisi',
            'partner.period.required' => 'Periode langganan lembaga harus diiisi',
            'partner.province.required' => 'Provinsi lembaga harus diiisi',
            'partner.regency.required' => 'Kab/kota lembaga harus diiisi',
            'partner.logo.image' => 'File harus berupa gambar.',
            'partner.logo.mimes' => 'Tipe file harus jpg, png, atau jpeg.',
            'partner.logo.max' => 'Ukuran file tidak boleh melebihi 2 MB.',
        ];
    }
}

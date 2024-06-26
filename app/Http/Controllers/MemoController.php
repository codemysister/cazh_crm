<?php

namespace App\Http\Controllers;

use App\Http\Requests\MemoRequest;
use App\Jobs\GenerateMemoJob;
use App\Models\Lead;
use App\Models\Memo;
use App\Models\Partner;
use App\Models\Signature;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\Browsershot\Browsershot;

class MemoController extends Controller
{
    public function index()
    {
        $usersProp = User::with('roles')->get();
        return Inertia::render('Memo/Index', compact('usersProp'));
    }

    public function create()
    {
        $signaturesProp = Signature::all();
        $partnersProp = Partner::with('status')->get();
        return Inertia::render('Memo/Create', compact('signaturesProp', 'partnersProp'));
    }

    public function edit($uuid)
    {
        $signaturesProp = Signature::all();
        $partnersProp = Partner::with('status')->get();
        $memo = Memo::with('partner', 'lead')->where('uuid', '=', $uuid)->first();
        return Inertia::render('Memo/Edit', compact('signaturesProp', 'partnersProp', 'memo'));
    }

    public function store(MemoRequest $request)
    {

        DB::beginTransaction();

        try {
            $memo = new Memo();
            $memo->uuid = Str::uuid();
            $memo->code = $this->generateCode();
            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $memo->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $memo->lead_id = $leadExist->id;
            }
            $memo->partner_name = $request['partner']['name'];
            $memo->date = Carbon::now();
            $memo->price_card = $request['price_card'];
            $memo->price_e_card = $request['price_e_card'];
            $memo->price_subscription = $request['price_subscription'];
            $memo->consideration = $request['consideration'];
            $memo->signature_applicant_name = $request['signature_applicant']['name'];
            $memo->signature_applicant_image = $request['signature_applicant']['image'];
            $memo->signature_acknowledges_name = $request['signature_acknowledges']['name'];
            $memo->signature_acknowledges_image = $request['signature_acknowledges']['image'];
            $memo->signature_agrees_name = $request['signature_agrees']['name'];
            $memo->signature_agrees_image = $request['signature_agrees']['image'];
            $memo->created_by = Auth::user()->id;
            $memo = $this->generateMemo($memo);
            $memo->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error tambah memo: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

    public function update(MemoRequest $request, $uuid)
    {
        DB::beginTransaction();

        try {

            $memo = Memo::where('uuid', '=', $uuid)->first();

            if ($request['partner']['type'] == 'partner') {
                $partnerExist = Partner::where('uuid', $request['partner']["uuid"])->first();
                $memo->partner_id = $partnerExist->id;
            } else {
                $leadExist = Lead::where('uuid', $request['partner']["uuid"])->first();
                $memo->lead_id = $leadExist->id;
            }
            $memo->partner_name = $request['partner']['name'];
            $memo->price_card = $request['price_card'];
            $memo->price_e_card = $request['price_e_card'];
            $memo->price_subscription = $request['price_subscription'];
            $memo->consideration = $request['consideration'];
            $memo->signature_applicant_name = $request['signature_applicant']['name'];
            $memo->signature_applicant_image = $request['signature_applicant']['image'];
            $memo->signature_acknowledges_name = $request['signature_acknowledges']['name'];
            $memo->signature_acknowledges_image = $request['signature_acknowledges']['image'];
            $memo->signature_agrees_name = $request['signature_agrees']['name'];
            $memo->signature_agrees_image = $request['signature_agrees']['image'];
            $memo = $this->generateMemo($memo);
            $memo->save();

            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error update memo: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function generateCode()
    {
        $currentMonth = date('n');
        $currentYear = date('Y');

        function intToRoman($number)
        {
            $map = array('I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII');
            return $map[$number - 1];
        }

        $lastDataCurrentMonth = Memo::withTrashed()->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $currentMonth)->latest()->first();

        $code = null;
        if ($lastDataCurrentMonth == null) {
            $code = "0000";
        } else {
            $parts = explode("/", $lastDataCurrentMonth->code);
            $code = $parts[1];
        }
        $codeInteger = intval($code) + 1;
        $latestCode = str_pad($codeInteger, strlen($code), "0", STR_PAD_LEFT);

        $romanMonth = intToRoman($currentMonth);
        $newCode = "MDH/$latestCode/$romanMonth/$currentYear";
        return $newCode;
    }

    public function generateMemo($memo)
    {
        $path = "memo/memo-" . $memo->uuid . ".pdf";

        $html = view('pdf.memo', ["memo" => $memo])->render();

        $pdf = Browsershot::html($html)
            ->setIncludedPath(config('services.browsershot.included_path'))
            ->showBackground()
            ->pdf();

        $memo->memo_doc = "storage/$path";

        Storage::put("public/$path", $pdf);

        return $memo;
    }



    public function destroy($uuid)
    {
        DB::beginTransaction();
        try {
            $memo = Memo::where('uuid', '=', $uuid)->first();
            Activity::create([
                'log_name' => 'deleted',
                'description' => 'hapus data memo',
                'subject_type' => get_class($memo),
                'subject_id' => $memo->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "deleted",
                'properties' => ["old" => ["code" => $memo->code, "partner_name" => $memo->partner_name, "price_card" => $memo->price_card, "price_e_card" => $memo->price_e_card, "price_subscription" => $memo->price_subscription, "consideration" => $memo->consideration]]
            ]);
            $memo->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus memo: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }

    public function apiGetMemo()
    {
        $memo = Memo::with('partner', 'lead', 'createdBy')->latest()->get();
        return response()->json($memo);
    }

    public function logFilter(Request $request)
    {
        $logs = Activity::with(['causer', 'subject'])->whereMorphedTo('subject', Memo::class);

        if ($request->user) {
            $logs->whereMorphRelation('causer', User::class, 'causer_id', '=', $request->user['id']);
        }

        if ($request->date['start'] && $request->date['end']) {
            $logs->whereBetween('created_at', [$request->date['start'], $request->date['end']]);
        }

        $logs = $logs->get();

        return response()->json($logs);
    }

    public function apiGetLogs()
    {
        $logs = Activity::with(['causer', 'subject'])
            ->whereMorphedTo('subject', Memo::class);

        $logs = $logs->latest()->get();

        return response()->json($logs);
    }

    public function destroyLogs(Request $request)
    {
        $ids = explode(",", $request->query('ids'));
        Activity::whereIn('id', $ids)->delete();
    }


    public function apiGetArsip()
    {
        $arsip = Memo::withTrashed()->with(['createdBy', 'partner', 'lead'])->whereNotNull('deleted_at')->latest()->get();
        return response()->json($arsip);
    }

    public function filter(Request $request)
    {
        $memos = Memo::with(['createdBy', 'lead', 'partner']);

        if ($request->user) {
            $memos->where('created_by', $request->user['id']);
        }
        if ($request->institution_type == 'Lead') {
            $memos->orWhereHas('lead');
        } else if ($request->institution_type == 'Partner') {
            $memos->orWhereHas('partner');
        }

        if ($request->input_date['start'] && $request->input_date['end']) {
            $memos->whereBetween('created_at', [Carbon::parse($request->input_date['start'])->setTimezone('GMT+7')->startOfDay(), Carbon::parse($request->input_date['end'])->setTimezone('GMT+7')->endOfDay()]);
        }

        $memos = $memos->get();

        return response()->json($memos);
    }

    public function arsipFilter(Request $request)
    {
        $arsip = Memo::withTrashed()->with(['createdBy', 'partner', 'lead'])->whereNotNull('deleted_at');

        if ($request->user) {
            $arsip->where('created_by', '=', $request->user['id']);
        }

        if ($request->delete_date['start'] && $request->delete_date['end']) {
            $arsip->whereBetween('deleted_at', [$request->delete_date['start'], $request->delete_date['end']]);
        }

        $arsip = $arsip->get();

        return response()->json($arsip);
    }

    public function restore($uuid)
    {
        DB::beginTransaction();
        try {
            $memo = Memo::withTrashed()->where('uuid', '=', $uuid)->first();
            $memo->restore();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error restore memo: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }
    }


    public function destroyForce($uuid)
    {
        DB::beginTransaction();
        try {
            $memo = Memo::withTrashed()->where('uuid', '=', $uuid)->first();
            unlink($memo->memo_doc);
            Activity::create([
                'log_name' => 'force',
                'description' => 'hapus permanen data memo',
                'subject_type' => get_class($memo),
                'subject_id' => $memo->id,
                'causer_type' => get_class(Auth::user()),
                'causer_id' => Auth::user()->id,
                "event" => "force",
                'properties' => ["old" => ["code" => $memo->code, "partner_name" => $memo->partner_name, "price_card" => $memo->price_card, "price_e_card" => $memo->price_e_card, "price_subscription" => $memo->price_subscription, "consideration" => $memo->consideration]]
            ]);
            $memo->forceDelete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollback();
            Log::error('Error hapus memo: ' . $e->getMessage());
            return redirect()->back()->withErrors([
                'error' => $e->getMessage()
            ]);
        }

    }

}

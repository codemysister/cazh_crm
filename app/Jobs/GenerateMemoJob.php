<?php

namespace App\Jobs;

use Exception;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Spatie\Browsershot\Browsershot;

class GenerateMemoJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    protected $memo;

    public function __construct($memo)
    {
        $this->memo = $memo;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {


            $path = "memo/memo-" . $this->memo->uuid . ".pdf";


            $html = view('pdf.memo', ["memo" => $this->memo])->render();

            $pdf = Browsershot::html($html)
                ->setIncludedPath(config('services.browsershot.included_path'))
                ->showBackground()
                ->pdf();

            $this->memo->update([
                "memo_doc" => "storage/$path"
            ]);

            Storage::put("public/$path", $pdf);

        } catch (Exception $exception) {
            info($exception->getMessage());
        }
    }
}

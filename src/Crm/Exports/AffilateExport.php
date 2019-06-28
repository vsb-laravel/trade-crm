<?php
namespace Vsb\Crm\Exports;

use Log;
use Vsb\Crm\Option;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AffilateExport implements FromCollection, WithHeadings, WithMapping{
    use Exportable;
    protected $opt;
    public function __construct($collection){
        $this->collection = $collection;
        $this->opt = Option::where('name','show_email_2_affilate')->first();
    }
    public function collection()
    {
        return $this->collection;
    }

    public function headings(): array
    {

        return ($this->opt->is_set())
            ?[
                'Registered',
                'Customer ID',
                'Customer',
                'Email',
                'Country',
                'Customer status',
                'Sum deposit amount'
            ]
            :[
                'Registered',
                'Customer ID',
                'Customer',
                'Country',
                'Customer status',
                'Sum deposit amount'
            ];
    }
    public function map($row): array
    {
        return ($this->opt->is_set())
            ?[
                date("Y-m-d",$row->created_at),
                $row->user_id,
                $row->name,
                $row->email,
                $row->country,
                $row->status,
                $row->amount,
            ]
            :[
                date("Y-m-d",$row->created_at),
                $row->user_id,
                $row->name,
                $row->country,
                $row->status,
                $row->amount,
            ];
    }
}
?>

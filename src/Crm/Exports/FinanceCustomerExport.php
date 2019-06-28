<?php
namespace Vsb\Crm\Exports;

use Log;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FinanceCustomerExport implements FromCollection, WithHeadings, WithMapping{
    use Exportable;
    public function __construct($collection){
        $this->collection = $collection;
    }
    public function collection()
    {
        return $this->collection;
    }

    public function headings(): array
    {
        return [
            'Customer ID',
            'Name',
            'Registered',
            'Email',
            'Phone',
            'Country',
            'Customer status',
            'Sum deposit amount',
            'Account balance'
        ];
    }
    public function map($row): array
    {
        return [
            $row->user_id,
            $row->name,
            $row->created_at,
            $row->email,
            $row->phone,
            isset($row->country)?$row->country:'',
            $row->status,
            $row->amount,
            $row->balance
        ];
    }
}
?>

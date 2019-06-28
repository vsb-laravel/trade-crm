<?php
namespace Vsb\Crm\Exports;

use Log;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FinanceExport implements FromCollection, WithHeadings, WithMapping{
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
            'Date',
            'Customer ID',
            'Customer',
            'Agent',
            'Agent 2',
            'Affilate',
            'Method',
            'Amount',
        ];
    }
    public function map($row): array
    {
        return [
            $row->date,
            $row->user_id,
            $row->name,
            $row->manager,
            $row->admin,
            $row->affilate,
            $row->method,
            $row->amount,
        ];
    }
}
?>

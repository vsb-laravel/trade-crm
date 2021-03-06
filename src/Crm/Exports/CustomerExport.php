<?php
namespace Vsb\Crm\Exports;

use Log;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CustomerExport implements FromCollection, WithHeadings, WithMapping{
    use Exportable;
    protected $from;
    protected $to;
    public function __construct($collection){
        $this->collection = $collection;
    }
    public function collection()
    {
        $arr = [];
        foreach ($this->collection as $row) {
            $a = [
                'id' => $row->id,
                'registered' => $row->created_at,
                'name' => $row->title,
                'email' => $row->email,
                'phone' => $row->phone,
                'status' => $row->status->title,
                'balance' => $row->balance,
                'manager' => is_null($row->manager)?'':$row->manager->title,
                'affilate' => is_null($row->affilate)?'':$row->affilate->title,
                'source' => is_null($row->lead)?'':$row->lead->source,
                'country' => $this->getMeta($row->meta,'country'),
                'kyc' => $this->getMeta($row->meta,'kyc')
            ];
            switch($a['kyc']){
                case '2':$a['kyc']='fully';break;
                case '1':$a['kyc']='partial';break;
                default: $a['kyc']='none';break;
            }
            $arr[]=$a;
        }
        return collect($arr);
    }

    public function headings(): array
    {
        return [
            'ID',
            'Registered',
            'Name',
            'Country',
            'Source',
            'Email',
            'Phone',
            'Status',
            'KYC',
            'Balance',
            'Manager',
            'Affilate',
        ];
    }
    public function map($row): array
    {
        return [
            $row['id'],
            $row['registered'],
            $row['name'],
            $row['country'],
            $row['source'],
            $row['email'],
            $row['phone'],
            $row['status'],
            $row['kyc'],
            $row['balance'],
            $row['manager'],
            $row['affilate'],
        ];
    }
    protected function getMeta($metas,$name){
        foreach ($metas as $meta) {
            if($meta->meta_name === $name) return $meta->meta_value;
        }
        return '';
    }
}
?>

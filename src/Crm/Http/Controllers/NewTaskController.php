<?php

namespace Vsb\Crm\Http\Controllers;

use App\User;
use App\Task;
use App\TaskType;
use Carbon\Carbon;
use App\TaskStatus;
use Illuminate\Http\Request;
use App\Rules\DateTaskValidation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class NewTaskController extends Controller
{
    public function index(Request $request)
    {
        $startDate = Carbon::parse($request->input('start_date'));
        $endDate = Carbon::parse($request->input('end_date'));

        if($request->input('checkClosedTask') == 'true')
        {
            $statusesId = [1,2,3];
        }
        else
        {
            $statusesId = [1,2];
        }

        $childs = $request->user()->childs;
        $availableUsers = User::where(function($q)use($childs){
                                    $q->whereIn('parent_user_id', $childs)->orWhereIn('affilate_id', $childs);
                                })
                              ->get()
                              ->pluck('id')
                              ->toArray();

        $availableUsers = array_merge($availableUsers,[Auth::id()]);
        $tasks = Task::whereIn('user_id', $availableUsers)
                     ->whereIn('status_id', $statusesId)
                     ->where(function ($query) use($startDate,$endDate) {
                         $query->orWhere(function ($w) use ($startDate, $endDate) {
                             $w->whereBetween('tasks.end_date', [$startDate, $endDate]);
                         })
                             ->orWhere(function ($e) use ($startDate, $endDate) {
                                 $e->whereBetween('tasks.start_date', [$startDate, $endDate]);
                             });
                     });

        if(!empty($request->input('object_id')))
        {
            $tasks = $tasks->where('object_id', '=', $request->input('object_id'));
        }

        $tasks = $tasks->get()->toArray();

        return response()->json(['tasks' => $tasks]);
    }

    public function showTask(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => ['required', Rule::exists('tasks','id')
                ->where(function ($query) {$query->where('user_id', Auth::id());})
            ],
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }

        // $task = Task::find($request->input('id'));
        $task = Task::select('tasks.*', 'users.id as id-user', 'users.name', 'users.surname', 'users.email')
                    ->leftJoin('users', 'tasks.object_id', '=', 'users.id')
                    ->where('tasks.id', '=', $request->input('id'))
                    ->first();

        return response()->json(['task' => $task]);

    }

    public function addTask(Request $request)
    {
        $data = collect($request->all())->except('_token')->toArray();

        $validator = Validator::make($data, [
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'text' => 'required|string|max:1000',
            'title'=> 'required|string|max:50',

            'object_id' => 'required',
            'object_type' => 'required|in:user,lead'

            ## Поставить валидцию для юзер ид, уточнить улосвие.
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data['start_date'] = Carbon::parse($data['start_date']);
        $data['end_date'] = Carbon::parse($data['end_date']);
        $data = array_merge($data, ['user_id' => Auth::id(), 'status_id' => 1, 'type_id' => 1]);

        $newTask = Task::create($data);

        return response()->json(['newTask' => $newTask]);
    }

    public function editTask(Request $request)
    {
        $data = $request->all();
        $startData = $data['start_date'] ?? '';
        $rules = ['id' => ['required', Rule::exists('tasks','id')->where(function ($query) {$query->where('user_id', Auth::id());})],
                  'start_date' => ['required','date', new DateTaskValidation($startData, $data['id'])],
                  'end_date' => 'required|date|after_or_equal:start_date',
                  'text' => 'required|string|max:1000',

                  'object_id' => 'required',
                  'object_type' => 'required|in:user,lead',

                  'title'=> 'required|string|max:50'];

        $rules = collect($rules)->intersectByKeys($data)->toArray();

        switch ($request->input('type', false))
        {
            case 'start_status';
                $data = array_merge($data, ['status_id' => 2]);
                break;
            case 'closed_status';
                $data = array_merge($data, ['status_id' => 3]);
                break;
            case 'new_status';
                $data = array_merge($data, ['status_id' => 1]);
                break;
            default:
                break;
        }

        $validator = Validator::make($data, $rules);

        if ($validator->fails())
        {
            return response()->json($validator->errors());
        }

        $data = collect($data)->except('type','_token')->toArray();

        if(!empty($data['start_date']))
        {
            $data['start_date'] = Carbon::parse($data['start_date']);
        }

        if(!empty($data['end_date']))
        {
            $data['end_date'] = Carbon::parse($data['end_date']);

        }

        $task = Task::find($data['id']);
        $updateTask = $task->update($data);

        return response()->json(['success' => true, 'task' => $data, 'title_task' => $task['title'],
                                'notice_task' => $task['text'], 'object_id_task' => $task['object_id']]);
    }

    public function deleteTask(Request $request)
    {
        $validator = Validator::make($request->all(), [
                'id' => ['required', Rule::exists('tasks','id')
                                         ->where(function ($query) {$query->where('user_id', Auth::id());})
                        ],
        ]);

        if ($validator->fails())
        {
            return response()->json($validator->errors(), 400);
        }

        $task = Task::destroy($request->input('id'));

        return response()->json(['success' => true]);
    }

    public function getUsersAvailable(Request $request)
    {
        $users = User::where('id', '=', 2)
                     // ->with(['users'])
                     ->get()
                     ->toArray();

    }

}

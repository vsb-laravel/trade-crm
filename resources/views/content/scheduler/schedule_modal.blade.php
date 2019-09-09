

<div class="ui tiny modal" id="addTaskModal">
    <i class="close icon"></i>
    <div class="header">Assign Task</div>
    <div class="content">
        <form class="ui form">
            <input type="hidden" id="userId">
            <div class="field" id="searchUserDiv">
                <label>Assign user</label>
                <input class="modal-input search-input" autocomplete="off" id="searchUser">
            </div>
            <div class="field" id="startTimeDiv">
                <label>Time start</label>
                <div class="ui calendar">
                    <input class="modal-input" id="startTime">
                </div>
            </div>
            <div class="field" id="endTimeDiv">
                <label>Time end</label>
                <div class="ui calendar">
                    <input class="modal-input" id="endTime">
                </div>
            </div>
            <div class="field" id="titleTaskDiv">
                <label>Title</label>
                <input class=" modal-input" id="titleTask">
            </div>
            <div class="field" id="noticeTaskDiv">
                <label>Notice</label>
                <textarea class="modal-input" id="noticeTask"></textarea>
            </div>
        </form> 
    </div>
    <div class="actions">
        <div class="ui button deny">Cancel</div>
        <div class="ui button" id="createTask">Create Task</div>
    </div>
</div>  


<div class="ui tiny modal" id="updateTaskModal">
    <i class="close icon"></i>
    <div class="header">Update Task</div>
    <div class="content">
        <input type="hidden" id="taskId">
        <input type="hidden" id="userId">
        <form class="ui form">
            <div class="field" id="searchUserEditDiv">
                <label>Assign user</label>
                <input class="modal-input search-input" autocomplete="off" id="searchUserEdit">
            </div>
            <div class="field" id="startTimeEditDiv">
                <label>Time start</label>
                <div class="ui calendar startTimeEdit">
                    <input class=" modal-input"  id="startTimeEdit">
                </div>
            </div>
            <div class="field" id="endTimeEditDiv">
                <label>Time end</label>
                <div class="ui calendar endTimeEdit">
                    <input class=" modal-input" id="endTimeEdit">
                </div>
            </div>
            <div class="field" id="titleTaskEditDiv">
                <label>Title</label>
                <input class="modal-input user-name" id="titleTaskEdit">
            </div>
            <div class="form-group" id="noticeTaskEditDiv">
                <label>Notice</label>
                <textarea class=" modal-input" id="noticeTaskEdit"></textarea>
            </div>
        </form>
    </div>
    <div class="actions">
        <div class="ui button deny">Cancel</div>
        <div class="ui button" id="updateTask">Update Task</div>
    </div>
</div>


<div class="ui tiny modal" id="deleteTask">
    <i class="close icon"></i>
    <div class="header">Are you sure you want to delete this task?</div>
    <div class="actions">
        <div class="ui button deny">Cancel</div>
        <div class="ui button" id="removeTask">Yes, delete it!</div>
    </div>
</div>

<div class="ui tiny modal" id="enableTask">
    <i class="close icon"></i>
    <div class="header">Are you sure you want to enable this task?</div>
    <div class="actions">
        <div class="ui button deny">Cancel</div>
        <div class="ui button" id="startTask">Yes, start it!</div>
    </div>
</div>

<div class="ui tiny modal" id="closeTask">
    <i class="close icon"></i>
    <div class="header">Are you sure you want to close this task?</div>
    <div class="actions">
        <div class="ui button deny">Cancel</div>
        <div class="ui button" id="disableTask">Yes, start it!</div>
    </div>
</div>






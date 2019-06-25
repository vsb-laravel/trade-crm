<div class="ui card" id="google2fa-{{Auth::id()}}">
    <div class="content">
        <div class="header">
            {{ trans('crm.private.google2fa.one_time_password') }}
        </div>
        <div class="description">
            {{ trans('crm.private.google2fa.manual', ["secret"=>$secret]) }}
        </div>
        <button class="ui primary button" onClick="{$(`#google2fa-{{Auth::id()}}`).slideUp()}">{{ trans('crm.message.ok') }}</button>
    </div>
</div>


<form class="form-horizontal" method="POST" action="{{ route('2fa') }}">
    {{ csrf_field() }}

    <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
        <label for="one_time_password" class="control-label">{{ trans('crm.private.google2fa.one_time_password') }}</label>

        <div>
            <input id="one_time_password" type="number" class="form-control" name="one_time_password" value="{{ old('one_time_password') }}" required autofocus>
            @if ($errors->has('one_time_password'))
                <span class="help-block">
                    <strong>{{ $errors->first('one_time_password') }}</strong>
                </span>
            @endif
        </div>
    </div>
    <div class="form-group">
        <div class="col-md-8 col-md-offset-2">
            <button type="submit" class="btn btn-primary">
                Login
            </button>
        </div>
    </div>
</form>

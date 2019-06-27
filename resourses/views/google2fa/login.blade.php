@extends('layouts.guest')

@section('content')
    <header class="header">
        <div class="shell">
            <div class="logo">
                <a href="{{ env('APP_URL') }}"><img src="/images/logo.png" alt=""></a>
            </div>
        </div>
    </header>
    <main class="main rega" style="flex:1 0 auto;">
        <div class="panel panel-login panel-default">
            <div class="panel-heading">
                <h2>LOGIN</h2>
            </div>
            <div class="panel-body">
                <form id ="form" class="form-horizontal" method="POST" action="{{ route('2fa') }}">
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
            </div>
        </div>
    </main>
    <script>
        document.body.onkeyup = function(e) {
            if (e.keyCode === 13) {
                document.getElementById('form').submit(); // your form has an id="form"
            }
            return true;
        }
        const otp =document.getElementById('one_time_password');
        if(otp)otp.onkeyup = function(e) {
            if(otp.value.length==6)document.getElementById('form').submit();
        }
     </script>
    @endsection

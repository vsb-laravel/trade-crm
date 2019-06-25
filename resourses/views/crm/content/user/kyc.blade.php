<!-- <div class="ui grid"> -->
    <div class="ui form submiter globe" data-action="/json/user/{{$user->id}}/update" data-callback="crm.user.touch">
        <div class="three fields">
            <div class="field">
                <label for="name">{{ trans('messages.name') }}</label>
                <input @can('retention') data-type="input" @else readonly ="readonly" @endcan type="text" data-name="name" placeholder="{{ trans('messages.Enter_your_name') }}" value="{{$user->name}}" >
            </div>
            <div class="field">
                <label for="l_name">{{ trans('messages.Surname') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="surname" placeholder="{{ trans('messages.Enter_last_name') }}" value="{{$user->surname}}">
            </div>
            <div class="field">
                <label for="l_name_l">{{ trans('messages.middle-name') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="midname" placeholder="{{ trans('messages.Enter_middle_name') }}"  value="{{$user->midname[0]->meta_value ?? ''}}">
            </div>
        </div>
        <div class="three fields">
            <div class="field">
                <label for="date">{{ trans('messages.Birthday') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="date" data-name="birthday" placeholder="{{ trans('messages.dd_mm_yyyy') }}" value="{{$user->birthday[0]->meta_value ?? ''}}">
            </div>
        </div>
        <div class="ui horizontal divider">{{ trans('messages.contacts') }}</div>
        <div class="two fields">
            <div class="field">
                <label for="tel">{{ trans('messages.phone') }}</label>
                <div class="ui action input">
                    <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="tel" data-name="phone" placeholder="{{ trans('messages.Enter_phone_number') }}" value="{{$user->phone}}">
                    <button class="ui icon button" onclick="crm.telephony.lazyLink('{{$user->phone}}')"><i class="phone icon"></i></button>
                </div>
            </div>
            <div class="field">
                <label for="tel">{{ trans('messages.email') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="tel" data-name="email" placeholder="{{ trans('messages.email') }}" value="{{$user->email}}">
            </div>
        </div>
        <div class="ui horizontal divider">{{ trans('messages.location') }}</div>
        <div class="three fields">
            @php($userCountry = '')
            @if(count($user->country))
                @php($userCountry = $user->country[0]->meta_value)
                @if($userCountry=='RU')
                    @php($userCountry='Russian Federation')
                @endif
            @endif
            <div class="field">
                <label for="country">{{ trans('messages.country') }}</label>
                <select data-name="country" class="ui search dropdown">
                @foreach($countries as $country)
                    <option value="{{$country["id"]}}" @if($userCountry == $country["id"]) selected="selected" @endif>{{$country["title"]}}</option>
                @endforeach
                </select>
            </div>
            @php($address = $user->address)

            <div class="field">
                <label for="city">{{ trans('messages.city') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="city" placeholder="{{ trans('messages.Enter_the_name_of_the_city') }}" value="@if(isset($address->city)) {{$address->city}} @endif">
            </div>

            <div class="field">
                <label for="name">{{ trans('messages.index') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="zip" placeholder="{{ trans('messages.Enter_the_index') }}" value="@if(isset($address->zip)) {{$address->zip}} @endif">
            </div>
        </div>
        <div class="field">
            <label for="address1">{{ trans('messages.address') }} 1</label>
            <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="address1" placeholder="{{ trans('messages.Enter_the_address') }} 1" value="@if(isset($address->address1)) {{$address->address1}} @endif">
        </div>
        <div class="field">
            <label for="address2">{{ trans('messages.address') }} 2</label>
            <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="address2" placeholder="{{ trans('messages.Enter_the_address') }} 2" value="@if(isset($address->address2)) {{$address->address2}} @endif">
        </div>
        <div class="ui horizontal divider">{{ trans('messages.passport') }}</div>
        @php($passport = $user->passport)
        <div style="display:none">
            {!! json_encode($passport) ?? 'object' !!}
        </div>
        <div class="fields">
            <div class="six wide field">
                <label for="pasport">{{ trans('messages.Passport-Series') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="passport" placeholder="{{ trans('messages.Enter_the_series') }}" value="{{$passport->series ?? ''}}">
            </div>
            <div class="ten wide field">
                <label for="num_pasport">{{ trans('messages.passport-ID') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="num_pasport" placeholder="{{ trans('messages.passport-ID') }}" value="{{$passport->num_pasport ?? ''}}">
            </div>
        </div>
        <div class="fields">
            <div class="ten wide field">
                <label for="kem">{{ trans('messages.Issued-by') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="text" data-name="issued" placeholder="{{ trans('messages.Issued-by') }}" value="{{$passport->issued ?? ''}}">
            </div>
            <div class="six wide field">
                <label for="until">{{ trans('messages.Valid-until') }}</label>
                <input @can('retention') data-type="input" @else readonly="readonly" @endcan type="date" data-name="until" placeholder="{{ trans('messages.dd_mm_yyyy') }}" value="{{$passport->until ?? ''}}">
            </div>
        </div>
        <div class="ui right">
            <button class="ui button green submit">{{ trans('messages.save') }}</button>
        </div>
    </div>
    @can("kyc")
    <div class="ui horizontal divider">{{ trans('messages.uploads') }}</div>
        @can('retention')
        <div class="ui form">
            <div class="two fields">
                <div class="ui field">
                    <label>Upload</label>
                    <input class="ui input fileupload" id="fileupload" type="file" name="upload[]" multiple data-url="/user/{{$user->id}}/upload"/>
                </div>
                <!-- <div class="ui right aligned field">
                    <label>&nbsp;</label>
                    <button class="ui green disabled button" id="uploadall">Upload all</button>
                </div> -->
            </div>
            <!-- <div class="ui progress" id="fileupload_progress"><div class="bar"><div class="progress"></div></div><div class="label">Uploading Files</div></div> -->
            <div class="ui list" id="fileupload_list"></div>
        </div>
        @endcan
    <script>
            $('#fileupload:not(.fileupload-assigned)').addClass('fileupload-assigned').fileupload({
                autoUpload: true,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|doc?x)$/i,
                maxFileSize: 999000,
                disableImageResize: /Android(?!.*Chrome)|Opera/.test(window.navigator.userAgent),
                previewMaxWidth: 100,
                previewMaxHeight: 100,
                previewCrop: true
            }).on('fileuploadadd', function (e, data) {
                $('#uploadall').removeClass('disabled');
                $.each(data.files, function (index, file) {
                    // console.debug(index,file);
                    let node = $(`<div class="ui item" data-name="${file.name}"/>`)
                            // .append($(`<img class="ui avatar image" src="/images/avatar2/small/rachel.png">`)
                            .append(`<div class="content" style="position:relative;">
                                        <a class="header">${file.name}</a>
                                        <div class="description">${(file.size/1024).toFixed(0)} Kb</div>
                                        <div class="ui progress fileupload-progress"><div class="bar"><div class="progress"></div></div><div class="label">Uploading File</div></div>
                                    </div>`);
                    node.find('.content button')
                                .on('click', function () {
                                    var $this = $(this),
                                        data = $this.data();
                                    $('#fileupload_progress').progress({percent: 0});
                                    $this
                                        .off('click')
                                        .html('<i class="ui ban icon"></i> Abort')
                                        .on('click', function () {
                                            $this.remove();
                                            data.abort();
                                        });
                                    data.submit().always(function () {
                                        $this.remove();
                                    });
                                }).data(data);
                    // node.find('.content').append(uploadButton.clone(true).data(data));
                    data.context = node;
                    node.appendTo('#fileupload_list');
                });
            }).on('fileuploadprocessalways', function (e, data) {
                var index = data.index,
                    file = data.files[index],
                    node = $(data.context.children()[index]);
                // console.debug('fileuploadprocessalways',file)
                if (file.preview) {
                    node.prepend(file.preview);
                }
                if (file.error) {
                    node.append($('<span class="text-danger"/>').text(file.error));
                }
            }).on('fileuploadprogressall', function (e, data) {
                console.debug('fileuploadprogressall:',e);
                const $prog = data.context;
                $('.fileupload-progress:first').progress({percent: parseInt(data.loaded / data.total * 100, 10)});
            }).on('fileuploaddone', function (e, data) {
                const doc = data.result;
                // console.debug('fileuploaddone',data);
                data.context.remove();
                const img = (doc.file.match(/\.(pdf|docx?)$/))
                    ?`<iframe src="https://docs.google.com/viewer?url={{Request::root()}}/${doc.file}&embedded=true" style="width: 100%; height: 100%" frameborder="0">{{ trans('crm.message.browser_doesnt_support') }}</iframe>`
                    :`<img src="${doc.file}"/>`;
                $('#uploaded').append(`<div class="card" id="kyc_{{$user->id}}_${doc.id}">
                    <a class="ui image" style="position:relative;" href="javascript:0" onclick="page.image.view(this,{'<i class=\\'check icon\\'></i>':'crm.user.kyc.accept(${doc.id},{{$user->id}})','<i class=\\'ban icon\\'></i>':'crm.user.kyc.decline(${doc.id},{{$user->id}})'})">
                        <div style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;"><i class="ui big green check icon"></i></div>
                        ${img}
                    </a>
                    <div class="content">
                        <div class="meta">
                            ${doc.created_at}
                        </div>
                    </div>
                    <div class="actions">
                        <button class="ui icon black button" onclick="crm.user.kyc.delete(${doc.id},{{$user->id}})"><i class="ui trash icon"></i></button>
                    </div>
                </div>`);
            }).on('fileuploadfail', function (e, data) {
                $.each(data.files, function (index) {
                    var error = $('<span class="text-danger"/>').text('File upload failed.');
                    $(data.context.children()[index])
                        .append('<br>')
                        .append(error);
                });
            }).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
        </script>

    <div class="ui cards" id="uploaded">

    @foreach($user->documents as $doc)
        <div class="card" id="kyc_{{$user->id}}_{{$doc->id}}">
            <a class="ui image" style="position:relative;cursor:pointer;" onclick="page.image.view(this,{'<i class=\'check icon\'></i>':'crm.user.kyc.accept({{$doc->id}},{{$user->id}})','<i class=\'ban icon\'></i>':'crm.user.kyc.decline({{$doc->id}},{{$user->id}})'})">
                <div class="verified" style="background-color:rgba(33,186,69,.2);position:absolute;width:100%;height:100%;@if($doc->status != 'verified') display:none; @endif"><i class="ui big green check icon"></i></div>
                @php($fi = pathinfo($doc->file))
                @if(in_array($fi['extension'],['png','jpg','jpeg','gif','bmp']))
                    <img src="{{$doc->file}}"/>
                @else
                    <iframe src="https://docs.google.com/viewer?url={{Request::root()}}/{{$doc->file}}&embedded=true" style="width: 100%; height: 100%" frameborder="0">{{ trans('crm.message.browser_doesnt_support') }}</iframe>
                @endif
            </a>
            <div class="content">
                <!-- <div class="header">{{$doc->type}}</div> -->
                <div class="meta">
                    {{$doc->created_at}}
                </div>
            </div>
            <div class="actions">
                <button class="ui icon black button" onclick="crm.user.kyc.delete({{$doc->id}},{{$user->id}})"><i class="ui trash icon"></i></button>
            </div>
        </div>
    @endforeach
    </div>
    @endcan
<!-- </div> -->

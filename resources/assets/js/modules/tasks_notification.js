$( document ).ready(function() {
	let functNotifTask = '';

	$.each(JSON.parse($('#notifTasks').text()), function(index, value) {
		// console.log(value['start_hour'],value['start_minute']);

  		functNotifTask += `setInterval(function () {
							var date = new Date();
							if (date.getHours() == ${value['start_hour']} &&  
							   (date.getMinutes() - ${value['start_minute']} <= 5) &&
							   (date.getMinutes() - ${value['start_minute']} >= 0))
							{						
								$().toastmessage('showToast', {
				                     text     : '${value['title']}<br>${value['text']}<br><a onclick=crm.user.card(${value['object_id']})>Просмотреть</a>',
				                     sticky   : true,
				                     position : 'top-right',
				                     type     : 'notice',
				                     closeText: '',
                				});
							}
						}, 300000);`;
	});

	eval(functNotifTask);  	
})

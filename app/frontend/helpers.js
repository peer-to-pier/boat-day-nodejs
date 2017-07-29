
var $page = function(page) {
	return $('[page="'+page+'"]');
};

var fbAsyncInit = function() {
	console.todo('check if it prints well');
	FB.init({
		appId      : '#{process.env.FB_APP_ID}',
		xfbml      : true,
		version    : 'v2.5'
	});
};

var AuthFBLogin = function() {
	console.todo('catch facebook errors');
	console.todo('Refine Scope');
	FB.login(function(response) {
		if (response.authResponse) {
			var $form = $('<form/>', { method: 'post', action: '/users/facebook' });
			$.each(response.authResponse, function(k, v) { 
				$form.append($('<input/>', { type: 'hidden', name: k, value: v }));
			});
			$form.submit();
		} else {
			// ToDo
			// - Catch Errors
			// console.error('FB Login error');
			// console.log(response)

		}
	}, {
		scope: "public_profile,email,user_about_me,user_birthday,user_friends" 
	});
};

console.todo = function(text) {
	console.debug('> ToDo: ' + text);
};

(function($) {

	$.fn.scrollTo = function() {
		$('html, body').animate({ 
			scrollTop: this.offset().top - $('#mainNavbar').height() 
		}, 'slow');
	};

	$.fn.field = function(names) {
		var str = "";
		$.each(names.split(','), function(x, item) {
			str += (str !== "" ? str += ', ' : '') + '[name="' + item.trim() + '"]';
		});
		return this.find(str);
	};

	$.fn.ajaxerize = function(event, done, fail) {
		event.preventDefault();
		event.stopPropagation();

		if( !this.attr('action') ) {
			console.error('Attribute "action" missing in <form>.');
			return false;
		}

		this.find('.has-danger').removeClass('has-danger');
		this.find('.form-control-danger').removeClass('form-control-danger').popover('dispose');	

		var requiredFieldsMissing = false, data = {};
		
		this.find('input, textarea').each(function(x, item) {
			var field = $(item);
			if( field.attr('required') && field.val() === "" ) {
				requiredFieldsMissing = true;
				field.customError('Ooops, you missed one.');
			}
			data[field.attr('name')] = field.val();
		});

		if( requiredFieldsMissing ) {
			return false;
		}

		this.find('[type="submit"]').attr('disabled', true);

		$.ajax({
			data: data,
			type: this.attr('method') ? this.attr('method') : 'GET',
			url: this.attr('action'),
			context: this
		})
		.done(function(data, status, jqXHR) {
			this.find('[type="submit"]').removeAttr('disabled');
			this.trigger('ajax-done', data.responseJSON);
		})
		.fail(function(data, status, jqXHR) {
			this.find('[type="submit"]').removeAttr('disabled');
			this.trigger('ajax-fail', data.responseJSON);
		});

		return this;
	};

	$.fn.customError = function(text) {

		if( text ) {
			this.popover({
				container: 'body',
				placement: 'top',
				content: text,
				trigger: 'hover',
				title: ''
			});
		}

		this.addClass("form-control-danger").closest('.form-group').addClass('has-danger');
		return this;
	};

	$.fn.cleanError = function(text) {
		this.popover('dispose').removeClass("form-control-danger").closest('.form-group').removeClass('has-danger');
		return this;
	};

})(jQuery);
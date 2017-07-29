

window.fbAsyncInit = fbAsyncInit;

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));



$(function() {

	$page('guest')
	.on('ajax-fail', '.login', function(event, response) {
		console.log($(this).field('email,pass'));
		if( response.code && response.code === 101 ) {
			$(this).field('email,pass').customError(response.message);
		}
	})
	.on('ajax-fail', '.signup', function(event, response) {
		console.log('success fail', response);
	})
	.on('click', '.fb-login', AuthFBLogin);

	$(document)
	.on('submit', 'form', function(event) {
		$(this).ajaxerize(event);
	})
	.on('click', 'a', function() {
		if( $(this).attr('href').substr(0,1) === '#' ) {
			$($(this).attr('href')).scrollTo();
		}
	});
});
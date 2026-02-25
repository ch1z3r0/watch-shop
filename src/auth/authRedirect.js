export function saveRedirectPath(location) {
	const path = location.pathname;

	// prevent overwriting with auth pages
	if (
		path === '/signin' ||
		path === '/signup' ||
		path === '/forgotpassword' ||
		path === '/resetpassword'
	)
		return;

	const next = location.pathname + location.search + location.hash;
	sessionStorage.setItem('redirectAfterLogin', next);
}

export function consumeRedirectPath(defaultPath = '/') {
	const next = sessionStorage.getItem('redirectAfterLogin');
	sessionStorage.removeItem('redirectAfterLogin');
	return next || defaultPath;
}

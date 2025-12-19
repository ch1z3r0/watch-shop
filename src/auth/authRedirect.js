export function saveRedirectPath(location) {
	const next = location.pathname + location.search + location.hash;
	sessionStorage.setItem('redirectAfterLogin', next);
}

export function consumeRedirectPath(defaultPath = '/') {
	const next = sessionStorage.getItem('redirectAfterLogin');
	sessionStorage.removeItem('redirectAfterLogin');
	return next || defaultPath;
}

const base =
	(typeof import.meta !== 'undefined' &&
		import.meta.env &&
		import.meta.env.VITE_CDN_BASE) ||
	process.env.REACT_APP_CDN_BASE ||
	'';

const version =
	(typeof import.meta !== 'undefined' &&
		import.meta.env &&
		import.meta.env.VITE_ASSETS_VERSION) ||
	process.env.REACT_APP_ASSETS_VERSION ||
	'';

export function cdnUrl(path, params) {
	const clean = path.startsWith('/') ? path.slice(1) : path;
	const url = new URL(`${base}/${clean}`);

	if (version) url.searchParams.set('v', String(version));
	if (params) {
		Object.entries(params).forEach(([k, v]) =>
			url.searchParams.set(k, String(v))
		);
	}
	return url.toString();
}

export const cdn = {
	image: (name, params) => cdnUrl(`images/${name}`, params),
	icon: (name, params) => cdnUrl(`icons/${name}`, params),
	font: (name, params) => cdnUrl(`fonts/${name}`, params),
	video: (name, params) => cdnUrl(`videos/${name}`, params),
};

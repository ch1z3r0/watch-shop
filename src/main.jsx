import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

import { ASSETS } from './utils/assets.js';
import samsungSharp from './assets/fonts/SamsungSharpSans-Bold.ttf';
// ---- inject fonts globally from ASSETS ----
(function injectSamsungFonts() {
	if (document.querySelector('style[data-fonts="samsung"]')) return; // avoid duplicates
	// console.log(ASSETS.samsungSharpSansBold);

	const css = `
	@font-face{
		font-family:"SamsungOne";
		src: url("${ASSETS.samsungOne}") format("truetype");
		font-weight:400;
		font-style:normal;
		font-display:swap;
		}
		@font-face{
			font-family:"SamsungSharpSans";
			src: url("${ASSETS.samsungSharpSansBold}") format("truetype");
		font-weight:700;
		font-style:normal;
		font-display:swap;
	}
	`.trim();

	const style = document.createElement('style');
	style.setAttribute('data-fonts', 'samsung');
	style.textContent = css;
	document.head.appendChild(style);
})();

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<App />
	</StrictMode>
);

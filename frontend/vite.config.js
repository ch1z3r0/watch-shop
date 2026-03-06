import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	// server: {
	// 	host: '127.0.0.1',
	// 	port: 3000,
	// },
});

// export default defineConfig({
// 	server: {
// 		headers: {
// 			'Content-Security-Policy': `style-src 'nonce-random' 'self'`,
// 		},
// 	},
// 	plugins: [react()],
// });

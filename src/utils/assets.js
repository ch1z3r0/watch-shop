import { cdn } from './cdn';

export const ASSETS = {
	//ICONS
	facebookIcon: cdn.icon('facebook-icon.svg'),
	githubIcon: cdn.icon('github-icon.svg'),
	googleIcon: cdn.icon('google-icon.svg'),
	linkedInIcon: cdn.icon('linkedin-icon.svg'),
	xTwitterIcon: cdn.icon('x-twitter-icon.svg'),
	play: cdn.icon('play-solid.svg'),
	pause: cdn.icon('pause-solid.svg'),
	mute: cdn.icon('volume-xmark-solid.svg'),
	unmute: cdn.icon('volume-solid.svg'),
	watchLogo: cdn.icon('watch-logo.svg'),
	arrowLeft: cdn.icon('arrow-left.svg'),

	//IMAGES
	signInBanner: cdn.image('watch1.svg'),
	signUpBanner: cdn.image('watch2.svg'),
	forgotPasswordBanner: cdn.image('forgot-password-icon.svg'),
	homepageBg: cdn.image('background.jpg'),
	bannerImg: cdn.image('galaxy-watch-ultra-2025.jpg'),
	bannerImgV2: cdn.image('galaxy-watch-ultra-2025-v2.jpg'),
	galaxyWatchUltraTitle: cdn.image('galaxy-watch-ultra-2025-logo-pc.png'),
	galaxyWatchUltraTitleMo: cdn.image('galaxy-watch-ultra-2025-logo-mo.png'),
	galaxyAiText: cdn.image('galaxy-watch-ultra-2025-kv-ai-text.png'),
	galaxyWatchUltraMarine01: cdn.image(
		'galaxy-watch-ultra-2025-marine01-pc.png',
	),
	galaxyWatchUltraMarine02: cdn.image('galaxy-watch-ultra-marine02-pc.webp'),
	galaxyWatchUltraMarine03: cdn.image('galaxy-watch-ultra-marine03-pc.jpg'),
	galaxyWatchUltraMarine04: cdn.image('galaxy-watch-ultra-marine04-pc.webp'),
	galaxyWatchUltraMarine05: cdn.image('galaxy-watch-ultra-marine05-pc.webp'),
	galaxyWatchUltraTrail01: cdn.image('galaxy-watch-ultra-trail01-pc.png'),
	galaxyWatchUltraTrail02: cdn.image('galaxy-watch-ultra-trail02-pc.jpg'),
	galaxyWatchUltraTrail03: cdn.image('galaxy-watch-ultra-trail03-pc.jpg'),
	galaxyWatchUltraTrail04: cdn.image('galaxy-watch-ultra-trail04-pc.webp'),
	galaxyWatchUltraPeakForm01: cdn.image('galaxy-watch-ultra-peakform01-pc.jpg'),
	galaxyWatchUltraPeakForm02: cdn.image(
		'galaxy-watch-ultra-peakform02-pc.webp',
	),
	galaxyWatchUltraPeakForm03: cdn.image('galaxy-watch-ultra-peakform03-pc.jpg'),

	//Videos
	commercialVideo: cdn.video('commercial.mp4'),
	slide1: cdn.video('Explore Galaxy Watch Ultra_1.webm'),
	slide2: cdn.video('Explore Galaxy Watch Ultra_2.webm'),
	slide3: cdn.video('Explore Galaxy Watch Ultra_3.webm'),
	slide4: cdn.video('Explore Galaxy Watch Ultra_4.mp4'),

	//Fonts
	samsungOne: cdn.font('SamsungOne-400.ttf'),
	samsungOne700: cdn.font('SamsungOne-700.ttf'),
	samsungSharpSansBold: cdn.font('SamsungSharpSans-Bold.ttf'),
};

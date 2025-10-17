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

	//IMAGES
	signInBanner: cdn.image('watch1.svg'),
	signUpBanner: cdn.image('watch2.svg'),
	homepageBg: cdn.image('background.jpg'),
	bannerImg: cdn.image('galaxy-watch-ultra-2025.jpg'),
	bannerImgV2: cdn.image('galaxy-watch-ultra-2025-v2.jpg'),
	galaxyWatchUltraTitle: cdn.image('galaxy-watch-ultra-2025-logo-pc.png'),
	galaxyWatchUltraTitleMo: cdn.image('galaxy-watch-ultra-2025-logo-mo.png'),
	galaxyAiText: cdn.image('galaxy-watch-ultra-2025-kv-ai-text.png'),

	//Videos
	commercialVideo: cdn.video('commercial.mp4'),
	slide1: cdn.video('Explore Galaxy Watch Ultra_1.webm'),
	slide2: cdn.video('Explore Galaxy Watch Ultra_2.webm'),
	slide3: cdn.video('Explore Galaxy Watch Ultra_3.webm'),
	slide4: cdn.video('Explore Galaxy Watch Ultra_4.mp4'),

	//Fonts
	samsungOne: cdn.font('SamsungOne-400.ttf'),
	samsungSharpSans: cdn.font('SamsungSharpSans-Bold.ttf'),
};

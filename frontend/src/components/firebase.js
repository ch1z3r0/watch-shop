// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
	FacebookAuthProvider,
	getAuth,
	GithubAuthProvider,
	GoogleAuthProvider,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDt_tXgTTKTPcI9zx0cCyQdloRc1omH10E',
	authDomain: 'watch-shop-g1.firebaseapp.com',
	projectId: 'watch-shop-g1',
	storageBucket: 'watch-shop-g1.firebasestorage.app',
	messagingSenderId: '709198672077',
	appId: '1:709198672077:web:84d2e3c67f116d47567984',
	measurementId: 'G-ZWT6M2DKK4',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('read:user'); //read public user profile data on Github
githubProvider.addScope('user:email'); //read users' verified email addresses

export const facebookProvider = new FacebookAuthProvider();

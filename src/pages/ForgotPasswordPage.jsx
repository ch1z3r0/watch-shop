import { ASSETS } from '../utils/assets';
import AuthLayout from '../layouts/AuthLayout';
import ForgotPassword from '../components/ForgotPassword';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
	const { forgotPasswordBanner } = ASSETS;
	const forgotPasswordImage = (
		<img
			src={forgotPasswordBanner}
			alt='Forgot Password Background'
			className='background-image'
		/>
	);
	return (
		<AuthLayout
			imageContent={forgotPasswordImage}
			formType='forgotPasswordForm'
		>
			<ForgotPassword />
		</AuthLayout>
	);
};

export default ForgotPasswordPage;

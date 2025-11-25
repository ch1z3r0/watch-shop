import { ASSETS } from '../utils/assets';
import AuthLayout from '../layouts/AuthLayout';
import './ForgotPasswordPage.css';
import ResetPassword from '../components/ResetPassword';

const ResetPasswordPage = () => {
	const { forgotPasswordBanner } = ASSETS;
	const resetPasswordImage = (
		<img
			src={forgotPasswordBanner}
			alt='Reset Password Background'
			className='background-image'
		/>
	);
	return (
		<AuthLayout imageContent={resetPasswordImage} formType='resetPasswordForm'>
			<ResetPassword />
		</AuthLayout>
	);
};

export default ResetPasswordPage;

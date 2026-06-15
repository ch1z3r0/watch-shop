import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useState } from 'react';

API_BASE = process.meta.env.VITE_API_BASE || 'http://localhost:5000';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const Checkout = () => {
	const { user } = useAuth();
	const {
		cartItems,
		cartTotal,
		clearCart,
		appliedPromo,
		discount,
		shipping,
		orderTotal,
	} = useCart();
	const navigate = useNavigate();

	const [paymentTab, setPaymentTab] = useState('card');
	const [submitting, setSubmitting] = useState(false);
	const [serverError, setServerError] = useState(null);
	const [placedOrder, setPlacedOrder] = useState(null);

	const [errors, setErrors] = useState({});

	const [form, setForm] = useState({
		email: user?.email || '',
		phone: '',
		firstName: '',
		lastName: '',
		address: '',
		city: '',
		zip: '',
		country: 'Cambodia',
		cardNumber: '',
		cardExpiry: '',
		cardCvc: '',
		cardName: '',
	});

	const set = (field) => (e) =>
		setForm((prev) => ({ ...prev, [field]: e.target.value }));
	// e collecting errors
	const validate = () => {
		const e = {};
		if (!form.email.trim()) e.email = 'Email is required';
		if (!form.phone.trim()) e.phone = 'Phone is required';
		if (!form.firstName.trim()) e.firstName = 'First name is required';
		if (!form.lastName.trim()) e.lastName = 'Last name is required';
		if (!form.address.trim()) e.address = 'Address is required';
		if (!form.city.trim()) e.city = 'City is required';
		if (!form.zip.trim()) e.zip = 'ZIP code is required';
		if (paymentTab === 'card') {
			if (!form.cardNumber.trim()) e.cardNumber = 'Card number is required';
			if (!form.cardExpiry.trim()) e.cardExpiry = 'Expiry is required';
			if (!form.cardCvc.trim()) e.cardCvc = 'CVC is required';
			if (!form.cardName.trim()) e.cardName = 'Name on card is required';
		}
		return e;
	};

	const handleSubmit = async () => {
		setServerError(null);
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setErrors({});
		setSubmitting(true);

		try {
			const token = await user.getIdToken();

			// Transform cart items into the shape the backend expects
			const items = cartItems.map((item) => ({
				productId: item.productId,
				variantId: item.variantId,
				productName: item.name,
				variantColor: item.color,
				size: item.size,
				image: item.image ? [item.image] : [],
				price: item.price,
				quantity: item.qty,
			}));

			const res = await axios.post(
				`${API_BASE}/api/orders/checkout`,
				{
					customerName: `${form.firstName} ${form.lastName}`.trim(),
					customerEmail: form.email,
					shippingAddress: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
					phone: form.phone,
					items,
					totalAmount: orderTotal,
					notes: '',
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			setPlacedOrder(res.data);
			clearCart();
		} catch (err) {
			setServerError(
				err.response?.data?.message ||
					'Something went wrong. Please try again.',
			);
		} finally {
			setSubmitting(false);
		}
	};

	return <div>Checkout</div>;
};

export default Checkout;

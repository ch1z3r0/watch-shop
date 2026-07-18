import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../context/CartContext';
import './Checkout.css';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import KHQRDisplay from '../components/KHQRDisplay/KHQRDisplay';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const COUNTRIES = [
	'United States',
	'Cambodia',
	'United Kingdom',
	'Australia',
	'Singapore',
];

// --- Country Dropdown -------------------------------------------------------------
const CountryDropdown = ({ value, onChange }) => {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className='co-dropdown' ref={ref}>
			<button
				type='button'
				className={`co-dropdown__trigger ${open ? 'is-open' : ''}`}
				onClick={() => setOpen((prev) => !prev)}
			>
				<span>{value}</span>
				<span className='co-dropdown__arrow'>▼</span>
			</button>

			{open && (
				<div className='co-dropdown__menu'>
					{COUNTRIES.map((country) => (
						<div
							key={country}
							className={`co-dropdown__option ${value === country ? 'is-selected' : ''}`}
							onClick={() => {
								onChange(country);
								setOpen(false);
							}}
						>
							{country}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

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

	//Payway States
	const [paywayLoading, setPaywayLoading] = useState(false);
	const [paywayError, setPaywayError] = useState(null);
	const [paywayCheckout, setPaywayCheckout] = useState(null);
	const [paywayPolling, setPaywayPolling] = useState(false);

	// KHQR States
	const [khqrData, setKhqrData] = useState(null);
	const [khqrLoading, setKhqrLoading] = useState(false);
	const [khqrError, setKhqrError] = useState(null);
	const [khqrExpired, setKhqrExpired] = useState(false);
	const pollIntervalRef = useRef(null);
	const pollTimeoutRef = useRef(null);
	const paywayPollIntervalRef = useRef(null);
	const paywayPollingRef = useRef(false);

	useEffect(() => {
		const handleMessage = (event) => {
			if (
				event.origin !== 'https://checkout.payway.com.kh' &&
				event.origin !== 'https://checkout-sandbox.payway.com.kh'
			) {
				return;
			}
			if (paywayCheckout?.fields?.tran_id && !paywayPollingRef.current) {
				startPaywayPolling(paywayCheckout.fields.tran_id);
			}
		};

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	}, [paywayCheckout]);

	useEffect(() => {
		if (paywayCheckout) {
			const tryCheckout = (attempts = 0) => {
				if (typeof AbaPayway !== 'undefined') {
					AbaPayway.checkout();
				} else if (attempts < 20) {
					setTimeout(() => tryCheckout(attempts + 1), 150);
				} else {
					setPaywayError(
						'PayWay checkout script failed to load. Please refresh and try again.',
					);
				}
			};
			tryCheckout();
		}
	}, [paywayCheckout]);

	// Stop polling helper
	const stopPolling = () => {
		if (pollIntervalRef.current) {
			clearInterval(pollIntervalRef.current);
			clearTimeout(pollTimeoutRef.current);
		}
		if (paywayPollIntervalRef.current) {
			clearInterval(paywayPollIntervalRef.current);
			setPaywayPolling(false);
		}
	};

	useEffect(() => {
		return () => {
			stopPolling();
		};
	}, []);

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

	//Handle Payway Payment
	const handlePaywayPay = async () => {
		const validateErrors = validate();
		if (Object.keys(validateErrors).length > 0) {
			setErrors(validateErrors);
			return;
		}
		setErrors({});

		setPaywayError(null);
		setPaywayLoading(true);

		try {
			const token = await user.getIdToken();
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
				`${API_BASE}/api/payments/payway/checkout`,
				{
					amount: orderTotal,
					firstname: form.firstName,
					lastname: form.lastName,
					email: form.email,
					phone: form.phone,
					shippingAddress: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
					items,
					totalAmount: orderTotal,
					notes: '',
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);

			setPaywayCheckout(res.data);
		} catch (error) {
			setPaywayError(
				error.response?.data?.message || 'Failed to start ABA PayWay checkout.',
			);
			setPaywayLoading(false);
		} finally {
			setPaywayLoading(false);
		}
	};

	const startPaywayPolling = (tran_id) => {
		if (paywayPollingRef.current) return; // extra safety
		paywayPollingRef.current = true;
		setPaywayPolling(true);

		paywayPollIntervalRef.current = setInterval(async () => {
			try {
				const token = await user.getIdToken();
				const res = await axios.post(
					`${API_BASE}/api/payments/payway/check`,
					{ tran_id },
					{ headers: { Authorization: `Bearer ${token}` } },
				);
				if (res.data.paid) {
					clearInterval(paywayPollIntervalRef.current);
					paywayPollingRef.current = false;
					setPaywayPolling(false);
					setPlacedOrder(res.data.order);
					clearCart();
				}
			} catch (error) {
				console.error('PayWay poll error:', error);
			}
		}, 3000);
	};

	// Handle KHQR Payment
	const handleKHQRPay = async () => {
		const validationErrors = validate();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}
		setErrors({});

		setKhqrError(null);
		setKhqrLoading(true);
		setKhqrExpired(false);
		try {
			const token = await user.getIdToken();

			const res = await axios.post(
				`${API_BASE}/api/payments/create`,
				{
					totalAmount: orderTotal,
					currency: 'usd',
				},
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			setKhqrData(res.data);

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

			const orderPayload = {
				md5: res.data.md5,
				orderId: res.data.orderId,
				customerName: `${form.firstName} ${form.lastName}`.trim(),
				customerEmail: form.email,
				shippingAddress: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
				phone: form.phone,
				items,
				totalAmount: orderTotal,
				notes: '',
			};

			pollTimeoutRef.current = setTimeout(
				() => {
					stopPolling();
					setKhqrExpired(true);
				},
				10 * 60 * 1000,
			);
			pollIntervalRef.current = setInterval(async () => {
				try {
					const res = await axios.post(
						`${API_BASE}/api/payments/check`,
						orderPayload,
						{ headers: { Authorization: `Bearer ${token}` } },
					);
					if (res.data.paid) {
						stopPolling();
						setPlacedOrder(res.data.order);
						clearCart();
					}
				} catch (error) {
					stopPolling();
					setKhqrError(
						error.response?.data?.message || 'Payment check failed.',
					);
				}
			}, 3000);
		} catch (error) {
			setKhqrError(
				error.response?.data?.message || 'Failed to checkout with KHQR.',
			);
		} finally {
			setKhqrLoading(false);
		}
	};

	// Order confirmed — show success screen, regardless of cart state
	if (placedOrder) {
		return (
			<div className='co-confirm'>
				<div className='co-confirm__box'>
					<svg
						viewBox='0 0 24 24'
						width='56'
						height='56'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.5'
					>
						<circle cx='12' cy='12' r='10' />
						<path d='M8 12l3 3 5-6' />
					</svg>
					<h1>Order Confirmed!</h1>
					<p>Thank you — your order has been placed.</p>
					<div className='co-confirm__orderid'>
						Order #{placedOrder.orderId}
					</div>
					<p className='co-confirm__note'>
						A confirmation has been noted at {placedOrder.customerEmail}.
					</p>
					<div className='co-confirm__actions'>
						<Link
							to='/shop'
							className='co-confirm__btn co-confirm__btn--secondary'
						>
							Continue Shopping
						</Link>
						<Link to='/track-order' className='co-confirm__btn'>
							Track Order
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// No items and nothing was just ordered — nothing to check out
	if (cartItems.length === 0) {
		return (
			<div className='co-confirm'>
				<div className='co-confirm__box'>
					<p>Your cart is empty.</p>
					<Link to='/shop' className='co-confirm__btn'>
						Go to Shop
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='co'>
			<div className='co__head'>
				<h1 className='co__title'>Checkout</h1>
				<Link to='/cart' className='co__back'>
					← Back to cart
				</Link>
			</div>

			<div className='co__layout'>
				<div className='co__form'>
					{/* Contact */}
					<div className='co-section'>
						<h2 className='co-section__title'>
							<span className='co-step'>1</span> Contact
						</h2>
						<div className='co-grid'>
							<div className='co-field full'>
								<label>Email *</label>
								<input
									type='email'
									value={form.email}
									onChange={set('email')}
								/>
								{errors.email && <p className='co-error'>{errors.email}</p>}
							</div>
							<div className='co-field full'>
								<label>Phone *</label>
								<input
									type='tel'
									placeholder='+1 (555) 000-0000'
									value={form.phone}
									onChange={set('phone')}
								/>
								{errors.phone && <p className='co-error'>{errors.phone}</p>}
							</div>
						</div>
					</div>

					{/* Shipping */}
					<div className='co-section'>
						<h2 className='co-section__title'>
							<span className='co-step'>2</span> Shipping Address
						</h2>
						<div className='co-grid'>
							<div className='co-field'>
								<label>First name *</label>
								<input value={form.firstName} onChange={set('firstName')} />
								{errors.firstName && (
									<p className='co-error'>{errors.firstName}</p>
								)}
							</div>
							<div className='co-field'>
								<label>Last name *</label>
								<input value={form.lastName} onChange={set('lastName')} />
								{errors.lastName && (
									<p className='co-error'>{errors.lastName}</p>
								)}
							</div>
							<div className='co-field full'>
								<label>Address *</label>
								<input
									placeholder='123 Summit Ave'
									value={form.address}
									onChange={set('address')}
								/>
								{errors.address && <p className='co-error'>{errors.address}</p>}
							</div>
							<div className='co-field'>
								<label>City *</label>
								<input value={form.city} onChange={set('city')} />
								{errors.city && <p className='co-error'>{errors.city}</p>}
							</div>
							<div className='co-field'>
								<label>ZIP code *</label>
								<input value={form.zip} onChange={set('zip')} />
								{errors.zip && <p className='co-error'>{errors.zip}</p>}
							</div>
							<div className='co-field full'>
								<label>Country</label>
								<CountryDropdown
									value={form.country}
									onChange={(country) =>
										setForm((prev) => ({ ...prev, country }))
									}
								/>
							</div>
						</div>
					</div>

					{/* Payment */}
					<div className='co-section'>
						<h2 className='co-section__title'>
							<span className='co-step'>3</span> Payment
						</h2>
						<div className='co-pay-tabs'>
							<button
								className={`co-pay-tab ${paymentTab === 'card' ? 'is-active' : ''}`}
								onClick={() => setPaymentTab('card')}
							>
								💳 Card
							</button>
							<button
								className={`co-pay-tab ${paymentTab === 'payway' ? 'is-active' : ''}`}
								onClick={() => setPaymentTab('payway')}
							>
								ABA PayWay
							</button>
							<button
								className={`co-pay-tab ${paymentTab === 'paypal' ? 'is-active' : ''}`}
								onClick={() => setPaymentTab('paypal')}
							>
								PayPal
							</button>
							<button
								className={`co-pay-tab ${paymentTab === 'khqr' ? 'is-active' : ''}`}
								onClick={() => setPaymentTab('khqr')}
							>
								🏦 KHQR
							</button>
						</div>

						{paymentTab === 'card' && (
							<div className='co-grid'>
								<div className='co-field full'>
									<label>Card number</label>
									<input
										placeholder='1234 5678 9012 3456'
										value={form.cardNumber}
										onChange={set('cardNumber')}
									/>
									{errors.cardNumber && (
										<p className='co-error'>{errors.cardNumber}</p>
									)}
								</div>
								<div className='co-field'>
									<label>Expiry</label>
									<input
										placeholder='MM / YY'
										value={form.cardExpiry}
										onChange={set('cardExpiry')}
									/>
									{errors.cardExpiry && (
										<p className='co-error'>{errors.cardExpiry}</p>
									)}
								</div>
								<div className='co-field'>
									<label>CVC</label>
									<input
										placeholder='123'
										value={form.cardCvc}
										onChange={set('cardCvc')}
									/>
									{errors.cardCvc && (
										<p className='co-error'>{errors.cardCvc}</p>
									)}
								</div>
								<div className='co-field full'>
									<label>Name on card</label>
									<input value={form.cardName} onChange={set('cardName')} />
									{errors.cardName && (
										<p className='co-error'>{errors.cardName}</p>
									)}
								</div>
							</div>
						)}

						{/* PayWay Tab Content */}
						{paymentTab === 'payway' && (
							<div className='payway-box'>
								{paywayError ? (
									<p className='co-error'>{paywayError}</p>
								) : paywayLoading || paywayCheckout ? (
									<p>Opening ABA PayWay checkout…</p>
								) : (
									<p>
										You'll be asked to complete payment via ABA PayWay after
										placing your order.
									</p>
								)}
							</div>
						)}

						{/* KHQR Tab Content */}
						{paymentTab === 'khqr' && (
							<div className='khqr-box'>
								{/* Idle state */}
								{!khqrData && !khqrLoading && !khqrExpired && (
									<div className='khqr-idle'>
										<svg
											viewBox='0 0 24 24'
											width='40'
											height='40'
											fill='none'
											stroke='currentColor'
											strokeWidth='1.4'
										>
											<rect x='3' y='3' width='7' height='7' rx='1' />
											<rect x='14' y='3' width='7' height='7' rx='1' />
											<rect x='3' y='14' width='7' height='7' rx='1' />
											<path d='M14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z' />
										</svg>
										<p>Pay instantly with any Bakong-supported app</p>
										<p className='khqr-idle-sub'>
											ABA, Wing, Acleda, and 60+ banks supported
										</p>
									</div>
								)}

								{/* Loading state */}
								{khqrLoading && (
									<div className='khqr-loading'>
										<div className='khqr-spinner' />
										<p>Generating QR code…</p>
									</div>
								)}

								{/* QR displayed state */}
								{khqrData && !khqrLoading && !khqrExpired && (
									<div className='khqr-qr-wrap'>
										<p className='khqr-instructions'>
											Open your banking app and scan to pay
										</p>
										<div className='khqr-qr-img-wrap'>
											<KHQRDisplay
												qrImage={khqrData.qrImage}
												merchantName="CHIRON's Watch Shop"
												amount={orderTotal.toLocaleString('en-US')}
												currency='USD'
											/>
										</div>
										<div className='poll-status'>
											<span className='poll-dot' />
											Waiting for payment…
										</div>
									</div>
								)}

								{/* Expired state */}
								{khqrExpired && (
									<div className='khqr-expired'>
										<svg
											viewBox='0 0 24 24'
											width='36'
											height='36'
											fill='none'
											stroke='currentColor'
											strokeWidth='1.4'
										>
											<circle cx='12' cy='12' r='10' />
											<path d='M12 6v6l4 2' />
										</svg>
										<p>QR code expired</p>
										<p className='khqr-expired-sub'>
											This QR is no longer valid. Generate a new one to
											continue.
										</p>
									</div>
								)}

								{/* Error */}
								{khqrError && <p className='khqr-error'>{khqrError}</p>}
							</div>
						)}

						{paymentTab !== 'card' &&
							paymentTab !== 'khqr' &&
							paymentTab !== 'payway' && (
								<p className='co-pay-placeholder'>
									You'll be redirected to complete payment after placing your
									order.
								</p>
							)}
					</div>

					{serverError && <p className='co-server-error'>{serverError}</p>}
				</div>
				<aside className='co-summary'>
					<h2 className='co-summary__title'>Order Summary</h2>

					{cartItems.map((item) => (
						<div
							key={`${item.productId}-${item.variantId}`}
							className='co-summary__item'
						>
							<div className='co-summary__img'>
								{item.image ? (
									<img src={item.image} alt={item.name} />
								) : (
									<div className='co-summary__img-placeholder' />
								)}
								<span className='co-summary__qty'>{item.qty}</span>
							</div>
							<div className='co-summary__info'>
								<p className='co-summary__name'>{item.name}</p>
								<p className='co-summary__variant'>
									{item.color} · {item.size}mm
								</p>
							</div>
							<span className='co-summary__price'>
								{formatPrice(item.price * item.qty)}
							</span>
						</div>
					))}

					<div className='co-divider' />

					<div className='co-row'>
						<span>Subtotal</span>
						<span>{formatPrice(cartTotal)}</span>
					</div>

					{appliedPromo && (
						<div className='co-row co-row--discount'>
							<span>Discount ({appliedPromo * 100}%)</span>
							<span>−{formatPrice(discount)}</span>
						</div>
					)}

					<div className='co-row'>
						<span>Shipping</span>
						<span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
					</div>

					<div className='co-total'>
						<span>Total</span>
						<span>{formatPrice(orderTotal)}</span>
					</div>

					<button
						className='co-place-btn'
						onClick={
							paymentTab === 'khqr'
								? handleKHQRPay
								: paymentTab === 'payway'
									? handlePaywayPay
									: handleSubmit
						}
						disabled={submitting || khqrLoading || paywayLoading}
					>
						{khqrLoading
							? 'Generating QR…'
							: paymentTab === 'khqr' && khqrData
								? `Awaiting Payment · ${formatPrice(orderTotal)}`
								: paywayLoading
									? 'Starting PayWay…'
									: submitting
										? 'Placing Order…'
										: `Place Order · ${formatPrice(orderTotal)}`}
					</button>

					<p className='co-secure'>🔒 Secure encrypted checkout</p>
				</aside>
			</div>

			{/* ABA PayWay hidden form */}
			<form
				id='aba_merchant_request'
				method='POST'
				target='aba_webservice'
				action={paywayCheckout?.action || ''}
				style={{ display: 'none' }}
			>
				{paywayCheckout?.fields &&
					Object.entries(paywayCheckout.fields).map(([key, value]) => (
						<input key={key} type='hidden' name={key} value={value} />
					))}
			</form>
		</div>
	);
};

export default Checkout;

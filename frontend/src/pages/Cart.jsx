import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 15; //TODO add functional shipping system later
const PROMO_CODES = { CHIRON10: 0.1 }; //TODO add backend promotions for flexibility

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const Cart = () => {
	const { cartItems, cartTotal, removeFromCart, updateQty } = useCart();
	const navigate = useNavigate();

	const [promoInput, setPromoInput] = useState('');
	const [appliedPromo, setAppliedPromo] = useState(null);
	const [appliedCode, setAppliedCode] = useState(null);
	const [promoError, setPromoError] = useState(false);

	const isEmpty = cartItems.length === 0;

	const subtotal = cartTotal;
	const discount = appliedPromo ? cartTotal * appliedPromo : 0;
	const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const total = subtotal - discount + shipping;

	const handleApplyPromo = () => {
		const code = promoInput.trim().toUpperCase();
		if (PROMO_CODES[code]) {
			setAppliedPromo(PROMO_CODES[code]);
			setAppliedCode(code);
			setPromoError(false);
		} else {
			setAppliedPromo(null);
			setAppliedCode(null);
			setPromoError(true);
		}
	};

	const handleRemovePromo = () => {
		setAppliedPromo(null);
		setAppliedCode(null);
		setPromoInput('');
		setPromoError(false);
	};

	if (isEmpty) {
		return (
			<div className='cart cart--empty'>
				<div className='cart__empty-box'>
					<svg
						viewBox='0 0 24 24'
						width='48'
						height='48'
						fill='none'
						stroke='currentColor'
						strokeWidth='1.4'
					>
						<path d='M6 7h12l-1 13H7zM9 7V5a3 3 0 0 1 6 0v2' />
					</svg>
					<h1>Your cart is empty</h1>
					<p>Browse the collection and add a few favorites.</p>
					<Link to='/shop' className='cart__empty-btn'>
						Continue shopping
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='cart'>
			<div className='cart__head'>
				<h1 className='cart__title'>Your Cart</h1>
				<span className='cart__count'>
					{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
				</span>
			</div>

			<div className='cart__layout'>
				<div className='cart__items'>
					{cartItems.map((item) => (
						<div
							key={`${item.productId}-${item.variantId}`}
							className='cart__item'
						>
							<div className='cart__item-img'>
								{item.image ? (
									<img src={item.image} alt={item.name} />
								) : (
									<div className='cart__item-img-placeholder' />
								)}
							</div>

							<div className='cart__item-info'>
								<p className='cart__item-brand'>{item.brandName}</p>
								<h3
									className='cart__item-name'
									onClick={() => navigate(`/product/${item.slug}`)}
								>
									{item.name}
								</h3>
								<div className='cart__item-meta'>
									<span className='cart__item-variant'>
										<span
											className='cart__item-dot'
											style={{ background: item.colorHex }}
										/>
										{item.color}
									</span>
									<span className='cart__item-size'>{item.size}mm</span>
								</div>
								<button
									className='cart__item-remove'
									onClick={() => removeFromCart(item.productId, item.variantId)}
								>
									✕ Remove
								</button>
							</div>

							<div className='cart__item-right'>
								<span className='cart__item-price'>
									{formatPrice(item.price * item.qty)}
								</span>
								<div className='cart__stepper'>
									<button
										onClick={() =>
											updateQty(item.productId, item.variantId, item.qty - 1)
										}
										disabled={item.qty <= 1}
									>
										−
									</button>
									<span>{item.qty}</span>
									<button
										onClick={() =>
											updateQty(item.productId, item.variantId, item.qty + 1)
										}
										disabled={item.qty >= item.stock}
									>
										+
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
				<aside className='cart__summary'>
					<h2 className='cart__summary-title'>Order Summary</h2>

					<div className='cart__promo-row'>
						<input
							type='text'
							placeholder='Promo code'
							value={promoInput}
							onChange={(e) => {
								(setPromoInput(e.target.value), setPromoError(false));
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleApplyPromo();
							}}
						/>
						{appliedPromo ? (
							<button onClick={handleRemovePromo}>Remove</button>
						) : (
							<button onClick={handleApplyPromo}>Apply</button>
						)}
					</div>

					{promoError && (
						<p className='cart__promo-error'>
							Hmm, that code doesn't look right.
						</p>
					)}
					{appliedPromo && (
						<p className='cart__promo-success'>"{appliedCode}" applied!</p>
					)}

					<div className='cart__summary-row'>
						<span>Subtotal</span>
						<span>{formatPrice(subtotal)}</span>
					</div>

					{appliedPromo && (
						<div className='cart__summary-row cart__summary-row--discount'>
							<span>Discount ({appliedPromo * 100}%)</span>
							<span>−{formatPrice(discount)}</span>
						</div>
					)}

					<div className='cart__summary-row'>
						<span>Shipping</span>
						<span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
					</div>

					<div className='cart__summary-total'>
						<span>Total</span>
						<span>{formatPrice(total)}</span>
					</div>

					<button
						className='cart__checkout-btn'
						onClick={() => navigate('/checkout')}
					>
						Proceed to Checkout
					</button>

					<p className='cart__secure-note'>🔒 Secure encrypted checkout</p>
				</aside>
			</div>
		</div>
	);
};

export default Cart;

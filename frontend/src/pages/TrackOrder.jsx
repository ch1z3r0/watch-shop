import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import './TrackOrder.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const formatPrice = (price) =>
	new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: 0,
	}).format(price);

const formatDate = (dateString) =>
	new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

const STATUS_STYLES = {
	Pending: 'status-pending',
	Processing: 'status-processing',
	Delivering: 'status-delivering',
	Delivered: 'status-delivered',
	Cancelled: 'status-cancelled',
};

const TrackOrder = () => {
	const { user } = useAuth();
	const [orders, setOrders] = useState([]);
	const [fetching, setFetching] = useState(false);
	const [error, setError] = useState(null);
	const [expandedId, setExpandedId] = useState(null);

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user) return;
			setFetching(true);
			setError(null);

			try {
				const token = await user.getIdToken();
				const res = await axios.get(`${API_BASE}/api/orders/my-orders`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setOrders(res.data);
			} catch (error) {
				setError(
					error.response?.data?.message || 'Failed to load your orders.',
				);
			} finally {
				setFetching(false);
			}
		};
		fetchOrders();
	}, [user]);

	// Loading, error and empty state

	if (fetching) {
		return (
			<div className='to-state'>
				<div className='to-spinner' />
				<p>Loading your orders…</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className='to-state'>
				<svg
					viewBox='0 0 24 24'
					width='48'
					height='48'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.4'
				>
					<circle cx='12' cy='12' r='10' />
					<line x1='12' y1='8' x2='12' y2='12' />
					<line x1='12' y1='16' x2='12.01' y2='16' />
				</svg>
				<p>{error}</p>
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<div className='to-state'>
				<svg
					viewBox='0 0 24 24'
					width='48'
					height='48'
					fill='none'
					stroke='currentColor'
					strokeWidth='1.4'
				>
					<path d='M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7' />
				</svg>
				<h1>No orders yet</h1>
				<p>When you place an order, it'll show up here.</p>
				<Link to='/shop' className='to-empty-btn'>
					Browse Watches
				</Link>
			</div>
		);
	}

	const THUMB_LIMIT = 3;

	const toggleExpand = (orderId) => {
		setExpandedId((prev) => (prev === orderId ? null : orderId));
	};

	return (
		<div className='to'>
			<div className='to__head'>
				<h1 className='to__title'>Your Orders</h1>
			</div>

			<div className='to__list'>
				{orders.map((order) => {
					const isExpanded = expandedId === order._id;
					const visibleItems = order.items.slice(0, THUMB_LIMIT);
					const remainingCount = order.items.length - THUMB_LIMIT;

					return (
						<div key={order._id} className='order-card'>
							<div className='order-card__top'>
								<div>
									<p className='order-card__id'>Order #{order.orderId}</p>
									<p className='order-card__date'>
										Placed {formatDate(order.createdAt)}
									</p>
								</div>
								<span
									className={`order-card__status ${STATUS_STYLES[order.status]}`}
								>
									{order.status}
								</span>
							</div>

							<div className='order-card__items'>
								{visibleItems.map((item, i) => (
									<div key={i} className='item-thumb'>
										{item.image?.[0] ? (
											<img src={item.image[0]} alt={item.productName} />
										) : (
											<div className='item-thumb__placeholder' />
										)}
									</div>
								))}
								{remainingCount > 0 && (
									<div className='item-thumb__more'>+{remainingCount}</div>
								)}
							</div>

							<div className='order-card__bottom'>
								<span className='order-card__total'>
									{formatPrice(order.totalAmount)}
								</span>
								<button
									className='order-card__expand'
									onClick={() => toggleExpand(order._id)}
								>
									{isExpanded ? 'Hide Details ↑' : 'View Details →'}
								</button>
							</div>
							{isExpanded && (
								<div className='order-card__details'>
									<div className='order-card__detail-section'>
										<h3>Shipping Address</h3>
										<p>{order.shippingAddress}</p>
										<p>{order.phone}</p>
									</div>

									<div className='order-card__detail-section'>
										<h3>Items</h3>
										{order.items.map((item, i) => (
											<div key={i} className='order-card__detail-item'>
												<div className='order-card__detail-item-info'>
													<span className='order-card__detail-item-name'>
														{item.productName}
													</span>
													<span className='order-card__detail-item-variant'>
														{item.variantColor} · {item.size}mm · Qty{' '}
														{item.quantity}
													</span>
												</div>
												<span className='order-card__detail-item-price'>
													{formatPrice(item.price * item.quantity)}
												</span>
											</div>
										))}
									</div>

									{order.notes && (
										<div className='order-card__detail-section'>
											<h3>Notes</h3>
											<p>{order.notes}</p>
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default TrackOrder;

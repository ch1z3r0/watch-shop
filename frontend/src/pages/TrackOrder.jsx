import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import './TrackOrder.css';
import axios from 'axios';

const API_BASE = process.import.env.VITE_API_BASE || 'http://localhost:5000';

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
				const token = await user.getTokenId();
				const res = await axios.get(`${API_BASE}/api/orders/my-orders`, {
					headers: { Authorization: `Bearer: ${token}` },
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

	return (
		<div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
			<h1
				style={{
					fontFamily: "'Playfair Display', Georgia, serif",
					fontStyle: 'italic',
				}}
			>
				Track Order
			</h1>
			<p style={{ color: 'var(--text-secondary)' }}>
				Coming soon — order tracking is on its way.
			</p>
		</div>
	);
};

export default TrackOrder;

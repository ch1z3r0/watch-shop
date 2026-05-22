export type OrderStatus =
	| 'Pending'
	| 'Processing'
	| 'Delivering'
	| 'Delivered'
	| 'Cancelled';

export interface OrderItem {
	productId: string;
	variantId: string;
	productName: string;
	variantColor: string;
	size: number;
	case: string;
	image: string[];
	mode: string[];
	price: number;
	quantity: number;
}

export interface Order {
	orderId: string;
	customerName: string;
	customerEmail: string;
	shippingAddress: string;
	phone: string;
	items: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	notes: string;
	createdAt: string;
	updatedAt: string;
}

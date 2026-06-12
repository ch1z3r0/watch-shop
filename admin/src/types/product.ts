export interface Variant {
	variantId: string;
	color: string;
	colorHex: string;
	size: number;
	stock: number;
	price: number;
	mode: string[];
	images: string[];
	featured: boolean;
	case: string;
}

export interface Product {
	productId: string;
	name: string;
	slug: string;
	brandId: string;
	categoryId: string;
	variants: Variant[];
	createdAt: string;
	updatedAt: string;
}

export interface FlatVariant extends Variant {
	productId: string;
	productName: string;
}

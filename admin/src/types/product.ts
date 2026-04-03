export interface Variant {
	variantId: string;
	color: string;
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
}

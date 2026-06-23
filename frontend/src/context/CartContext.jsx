import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'chirons_cart';

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 0; //TODO add functional shipping system later
const PROMO_CODES = { CHIRON10: 0.1 }; //TODO add backend promotions for flexibility

export const CartProvider = ({ children }) => {
	const [appliedPromo, setAppliedPromo] = useState(null);
	const [appliedCode, setAppliedCode] = useState(null);

	const applyPromo = (code) => {
		const normalized = code.trim().toUpperCase();
		if (PROMO_CODES[normalized]) {
			setAppliedPromo(PROMO_CODES[normalized]);
			setAppliedCode(normalized);
			return true;
		} else {
			setAppliedPromo(null);
			setAppliedCode(null);
			return false;
		}
	};

	const removePromo = () => {
		setAppliedPromo(null);
		setAppliedCode(null);
	};

	const [cartItems, setCartItems] = useState(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : [];
		} catch {
			return [];
		}
	});
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
	}, [cartItems]);

	const addToCart = (product, variant, qty = 1, brandName = '') => {
		setCartItems((prev) => {
			const existingIndex = prev.findIndex(
				(item) =>
					item.productId === product.productId &&
					item.variantId === variant.variantId,
			);

			if (existingIndex !== -1) {
				const updated = [...prev];
				const newQty = Math.min(
					updated[existingIndex].qty + qty,
					variant.stock,
				);
				updated[existingIndex] = { ...updated[existingIndex], qty: newQty };
				return updated;
			}

			return [
				...prev,
				{
					productId: product.productId,
					variantId: variant.variantId,
					name: product.name,
					slug: product.slug,
					brandId: product.brandId,
					brandName: brandName || product.brandId,
					color: variant.color,
					colorHex: variant.colorHex,
					size: variant.size,
					price: variant.price,
					image: variant.images?.[0] || null,
					stock: variant.stock,
					qty: Math.min(qty, variant.stock),
				},
			];
		});
	};

	const removeFromCart = (productId, variantId) => {
		setCartItems((prev) =>
			prev.filter(
				(item) =>
					!(item.productId === productId && item.variantId === variantId),
			),
		);
	};

	const updateQty = (productId, variantId, newQty) => {
		setCartItems((prev) =>
			prev.map((item) => {
				if (item.productId === productId && item.variantId === variantId) {
					const clamped = Math.max(1, Math.min(newQty, item.stock));
					return { ...item, qty: clamped };
				}
				return item;
			}),
		);
	};

	const clearCart = () => {
		setCartItems([]);
		setAppliedCode(null);
		setAppliedPromo(null);
	};

	const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

	const cartTotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);

	const subtotal = cartTotal;
	const discount = appliedPromo ? cartTotal * appliedPromo : 0;
	const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
	const orderTotal = subtotal - discount + shipping;

	return (
		<CartContext.Provider
			value={{
				cartItems,
				cartCount,
				cartTotal,
				addToCart,
				removeFromCart,
				updateQty,
				clearCart,
				appliedCode,
				appliedPromo,
				applyPromo,
				removePromo,
				subtotal,
				discount,
				shipping,
				orderTotal,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);

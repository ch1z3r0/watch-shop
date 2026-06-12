import { createContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'chirons_cart';

export const CartProvider = ({ children }) => {
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

	const addToCart = (product, variant, qty = 1) => {
		setCartItems((prev) => {
			const existingIndex = prev.findIndex(
				(item) =>
					item.productId === product._id &&
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
					productId: product._id,
					variantId: variant.variantId,
					name: product.name,
					slug: product.slug,
					brandId: product.brandId,
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

	const clearCart = () => setCartItems([]);

	const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

	const cartTotal = cartItems.reduce(
		(sum, item) => sum + item.price * item.qty,
		0,
	);

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
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);

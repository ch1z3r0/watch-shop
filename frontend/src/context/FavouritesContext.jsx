import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import axios from 'axios';

const FavouritesContext = createContext();

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const FavouritesProvider = ({ children }) => {
	const { user } = useAuth();
	const [favourites, setFavourites] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// Get firebase token for current user
	const getToken = async () => await user.getIdToken();

	// Fetch Favourites when user log in

	useEffect(() => {
		if (!user) {
			setFavourites([]);
			return;
		}
		const fetchFavourites = async () => {
			try {
				setIsLoading(true);
				const token = await getToken();
				const res = await axios.get(`${API_BASE}/api/favourites`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setFavourites(res.data);
			} catch (error) {
				console.error('Failed to fetch error', error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchFavourites();
	}, [user]);

	// Add favourites
	const addFavourites = async (product) => {
		try {
			const token = await getToken();
			const res = await axios.post(
				`${API_BASE}/api/favourites/${product._id}`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			setFavourites(res.data);
		} catch (error) {
			console.error('Failed to add favourites', error);
		}
	};

	// Remove favourites
	const removeFavourites = async (productId) => {
		try {
			const token = await getToken();
			const res = await axios.delete(
				`${API_BASE}/api/favourites/${productId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			setFavourites(res.data);
		} catch (error) {
			console.error('Failed to remove favourites', error);
		}
	};

	const isFavourite = (productId) => {
		return favourites.some((p) => p._id === productId);
	};

	return (
		<FavouritesContext.Provider
			value={{
				favourites,
				favCount: favourites.length,
				addFavourites,
				removeFavourites,
				isFavourite,
				isLoading,
			}}
		>
			{children}
		</FavouritesContext.Provider>
	);
};

export const useFavourites = () => useContext(FavouritesContext);

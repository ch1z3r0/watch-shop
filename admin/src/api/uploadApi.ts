import api from './axios';

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append('image', file);

	const res = await api.post('/api/upload', formData);

	return res.data.url;
};

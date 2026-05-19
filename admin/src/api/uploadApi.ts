import api from './axios';

export const uploadImage = async (file: File): Promise<string> => {
	const formData = new FormData();
	formData.append('image', file);

	const res = await api.post('/api/upload', formData);

	return res.data.url;
};

export const deleteImage = async (url: string): Promise<void> => {
	const key = new URL(url).pathname.slice(1);
	await api.delete('/api/upload', { data: { key } });
};

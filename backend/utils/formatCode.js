const formatCode = (prefix, number, pad = 3) => {
	return `${prefix}${String(number).padStart(pad, '0')}`;
};
export default formatCode;

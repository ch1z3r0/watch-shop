import Counter from '../models/Counter.js';

const getNextSequence = async (counterName) => {
	const counter = await Counter.findByIdAndUpdate(
		counterName,
		{ $inc: { seq: 1 } },
		{
			new: true,
			upsert: true,
		},
	);

	return counter.seq;
};

export default getNextSequence;

import './FullScreenLoader.css';

export default function FullScreenLoader({ message = 'Loading…' }) {
	return (
		<div className='wrap'>
			<div className='card'>
				<div className='loader' />
				<div className='text'>{message}</div>
			</div>
		</div>
	);
}

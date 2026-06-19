import { useState } from 'react';
import './Promotions.css';
import { Link } from 'react-router-dom';

const PROMOTIONS = [
	{
		code: 'CHIRON10',
		discount: '10%',
		title: "Welcome to CHIRON's.",
		description:
			'Use our welcome code at checkout and save on your first smartwatch purchase.',
		detail: 'No minimum spend required — works on any order, any brand.',
	},
];

const Promotions = () => {
	const [copiedCode, setCopiedCode] = useState(null);

	const handleCopy = async (code) => {
		try {
			await navigator.clipboard.writeText(code);
			setCopiedCode(code);
			setTimeout(() => setCopiedCode(null), 2000);
		} catch (error) {
			console.error('Failed to copy', error);
		}
	};

	const featured = PROMOTIONS[0];

	return (
		<div className='promo'>
			<div className='promo__hero'>
				<div className='promo__hero-left'>
					<h1>{featured.title}</h1>
					<p>{featured.description}</p>
					<button
						className='promo__code-pill'
						onClick={() => handleCopy(featured.code)}
					>
						{copiedCode === featured.code ? 'Copied!' : featured.code}
					</button>
				</div>
				<div className='promo__hero-right'>
					<span className='promo__discount'>{featured.discount}</span>
					<span className='promo__discount-label'>Off Everything</span>
				</div>
			</div>

			<div className='promo__grid'>
				<div className='promo__card'>
					<h3>No minimum spend</h3>
					<p>{featured.detail}</p>
					<button
						className='promo__code-pill promo__code-pill--small'
						onClick={() => handleCopy(featured.code)}
					>
						{copiedCode === featured.code ? 'Copied!' : featured.code}
					</button>
				</div>

				<div className='promo__card promo__card--placeholder'>
					<h3>More deals coming soon</h3>
					<p>
						Seasonal sales and limited-time offers are on the way — check back
						soon.
					</p>
					<span className='promo__code-pill promo__code-pill--small promo__code-pill--disabled'>
						Stay Tuned
					</span>
				</div>
			</div>

			<div className='promo__footer'>
				<p>Have a question about a promotion?</p>
				<Link to='/shop'>Continue shopping →</Link>
			</div>
		</div>
	);
};

export default Promotions;

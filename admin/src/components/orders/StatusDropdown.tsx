import { useState, useRef, useEffect } from 'react';
import { OrderStatus } from '../../types/order';

const STATUS_OPTIONS: OrderStatus[] = [
	'Pending',
	'Processing',
	'Delivering',
	'Delivered',
	'Cancelled',
];

const statusStyles: Record<OrderStatus, string> = {
	Pending:
		'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
	Processing:
		'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
	Delivering:
		'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
	Delivered:
		'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
	Cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

interface Props {
	orderId: string;
	status: OrderStatus;
	onUpdate: (orderId: string, status: OrderStatus) => Promise<void>;
}

export default function StatusDropdown({ orderId, status, onUpdate }: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [current, setCurrent] = useState<OrderStatus>(status);
	const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
	const buttonRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close when clicking outside
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (
				buttonRef.current &&
				!buttonRef.current.contains(e.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);
	useEffect(() => {
		setCurrent(status);
	}, [status]);

	// Calculate position when opening
	const handleOpen = () => {
		if (isSaving) return;
		if (!isOpen && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			const dropdownHeight = 170; // approximate height of dropdown
			const spaceBelow = window.innerHeight - rect.bottom;
			const spaceAbove = rect.top;

			// If not enough space below but enough above, flip upward
			const top =
				spaceBelow < dropdownHeight && spaceAbove > dropdownHeight
					? rect.top - dropdownHeight - 4 //  open upward
					: rect.bottom + 4; //  open downward

			setDropdownPos({
				top,
				left: rect.left,
			});
		}
		setIsOpen((prev) => !prev);
	};

	const handleSelect = async (newStatus: OrderStatus) => {
		if (newStatus === current) {
			setIsOpen(false);
			return;
		}
		setIsSaving(true);
		setIsOpen(false);
		try {
			await onUpdate(orderId, newStatus);
			setCurrent(newStatus);
		} catch (err) {
			console.error('Failed to update status', err);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className='relative inline-block'>
			{/* Trigger badge */}
			<button
				ref={buttonRef}
				onClick={handleOpen}
				disabled={isSaving}
				className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-opacity ${statusStyles[current]} ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
			>
				{isSaving ? 'Saving...' : current}
				{!isSaving && (
					<svg
						width='10'
						height='10'
						viewBox='0 0 24 24'
						fill='none'
						className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
					>
						<path
							d='M6 9l6 6 6-6'
							stroke='currentColor'
							strokeWidth='2.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</button>

			{/* Dropdown — fixed position to escape overflow containers */}
			{isOpen && (
				<div
					ref={dropdownRef}
					style={{ top: dropdownPos.top, left: dropdownPos.left }}
					className='fixed z-50 min-w-[140px] rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-gray-dark shadow-lg py-1'
				>
					{STATUS_OPTIONS.map((option) => (
						<button
							key={option}
							onClick={() => handleSelect(option)}
							className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors ${
								option === current
									? 'text-brand-500'
									: 'text-gray-700 dark:text-gray-300'
							}`}
						>
							<span
								className={`w-2 h-2 rounded-full flex-shrink-0 ${
									option === 'Pending'
										? 'bg-yellow-400'
										: option === 'Processing'
											? 'bg-blue-400'
											: option === 'Delivering'
												? 'bg-purple-400'
												: option === 'Delivered'
													? 'bg-green-400'
													: 'bg-red-400'
								}`}
							/>
							{option}
							{option === current && (
								<svg
									className='ml-auto'
									width='12'
									height='12'
									viewBox='0 0 24 24'
									fill='none'
								>
									<path
										d='M20 6L9 17l-5-5'
										stroke='currentColor'
										strokeWidth='2.5'
										strokeLinecap='round'
										strokeLinejoin='round'
									/>
								</svg>
							)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}

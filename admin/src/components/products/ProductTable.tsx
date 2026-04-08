import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';
import useProducts from '../../hooks/useProducts';

export default function ProductTable() {
	const { products, isLoading, error, brandMap, categoryMap } = useProducts();
	return (
		<div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
			<div className='max-w-full overflow-x-auto'>
				<Table>
					{/* Table Header */}
					<TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
						<TableRow>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Product Name
							</TableCell>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Brand
							</TableCell>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Category
							</TableCell>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Variants
							</TableCell>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Stock
							</TableCell>
							<TableCell
								isHeader
								className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
							>
								Price Range
							</TableCell>
						</TableRow>
					</TableHeader>

					{/* Table Body */}
					<TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
						{products.map((product) => (
							<TableRow key={product.productId}>
								<TableCell className='px-5 py-4 sm:px-6 text-start'>
									<div className='flex items-center gap-3'>
										{/* <div className='w-10 h-10 overflow-hidden rounded-full'>
											<img
												width={40}
												height={40}
												// src={product.user.image}
												alt={product.name}
											/>
										</div> */}
										<div>
											<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
												{product.name}
											</span>
											{/* <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
												{product.role}
											</span> */}
										</div>
									</div>
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									{brandMap[product.brandId] || product.brandId}
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									{categoryMap[product.categoryId] || product.categoryId}
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									{product.variants?.length || 0}
								</TableCell>
								{/* <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									<div className='flex -space-x-2'>
										{product.team.images.map((teamImage, index) => (
											<div
												key={index}
												className='w-6 h-6 overflow-hidden border-2 border-white rounded-full dark:border-gray-900'
											>
												<img
													width={24}
													height={24}
													src={teamImage}
													alt={`Team member ${index + 1}`}
													className='w-full size-6'
												/>
											</div>
										))}
									</div>
								</TableCell> */}
								{/* <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									<Badge
										size='sm'
										color={
											product.status === 'Active'
												? 'success'
												: product.status === 'Pending'
													? 'warning'
													: 'error'
										}
									>
										{product.status}
									</Badge>
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
									{product.budget}
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
									{product.budget} - {product.budget}
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400'>
									[View Variant]
								</TableCell> */}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

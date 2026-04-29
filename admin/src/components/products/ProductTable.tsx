import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

import Badge from '../ui/badge/Badge';
import useProducts, {
	getTotalStock,
	getPriceRange,
} from '../../hooks/useProducts';

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
										<div>
											<span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
												{product.name}
											</span>
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
								<TableCell className='px-4 py-3 text-start text-theme-sm'>
									{(() => {
										const total = getTotalStock(product.variants ?? []);
										const color =
											total === 0
												? 'error'
												: total < 10
													? 'warning'
													: 'success';
										return (
											<Badge size='sm' color={color}>
												{total} units
											</Badge>
										);
									})()}
								</TableCell>
								<TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
									{getPriceRange(product.variants ?? [])}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

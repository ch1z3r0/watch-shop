import PageMeta from '../components/common/PageMeta';
import PageBreadcrumb from '../components/common/PageBreadCrumb';
import OrderTable from '../components/orders/OrderTable';

export default function Orders() {
	return (
		<>
			<PageMeta title='Orders | Chiron Admin' description='Manage orders' />
			<PageBreadcrumb pageTitle='Orders' />
			<div className='rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-white/[0.05] dark:bg-white/[0.03] lg:px-6'>
				<div className='flex items-center justify-between mb-5'>
					<div>
						<h3 className='text-base font-semibold text-gray-800 dark:text-white/90'>
							Orders
						</h3>
						<p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>
							Manage and track all customer orders.
						</p>
					</div>
				</div>
				<OrderTable />
			</div>
		</>
	);
}

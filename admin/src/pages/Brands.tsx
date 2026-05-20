import PageBreadcrumb from '../components/common/PageBreadCrumb';
import ComponentCard from '../components/common/ComponentCard';
import PageMeta from '../components/common/PageMeta';
import BrandTable from '../components/brands/BrandTable';
export default function Brands() {
	return (
		<>
			<PageMeta
				title='React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template'
				description='This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template'
			/>
			<PageBreadcrumb pageTitle='Brand' />
			<div className='space-y-6'>
				<ComponentCard title='List of Brands'>
					<BrandTable />
				</ComponentCard>
			</div>
		</>
	);
}

// backend/seeds/data.js
//
// Seed fixture for watch-shop.
//
// This is the canonical example of what correct catalog data looks like.
// Every field in the current Product/Variant schema is represented, including
// the fields added in the product-model migration: description + isActive on
// products, sku + specs + isActive on variants.
//
// IDs are fixed, not generated. The seed script sets the counters past them so
// records created afterwards through the admin continue from the right number.
//
// Images use placehold.co so a fresh database renders something sensible
// without depending on R2 or external CDNs. Swap them for real assets when you
// have them.

export const brands = [
	{ brandId: 'B001', name: 'Samsung', slug: 'samsung' },
	{ brandId: 'B002', name: 'Apple', slug: 'apple' },
	{ brandId: 'B003', name: 'Garmin', slug: 'garmin' },
	{ brandId: 'B004', name: 'Amazfit', slug: 'amazfit' },
	{ brandId: 'B005', name: 'Huawei', slug: 'huawei' },
	{ brandId: 'B006', name: 'Fitbit', slug: 'fitbit' },
	{ brandId: 'B007', name: 'Withings', slug: 'withings' },
];

export const categories = [
	{ categoryId: 'C001', name: 'Smartwatch', slug: 'smartwatch' },
	{ categoryId: 'C002', name: 'Hybrid Watch', slug: 'hybrid-watch' },
	{ categoryId: 'C003', name: 'Fitness Band', slug: 'fitness-band' },
];

const img = (hex, label) =>
	`https://placehold.co/800x800/${hex}/ffffff?text=${encodeURIComponent(label)}`;

export const products = [
	// ─── P001 — many variants, one sold out, one featured ────────────────────
	{
		productId: 'P001',
		name: 'Galaxy Watch Ultra',
		slug: 'galaxy-watch-ultra',
		brandId: 'B001',
		categoryId: 'C001',
		description:
			'A rugged titanium smartwatch built for endurance training and open-water swimming. ' +
			'Dual-frequency GPS, a 3,000-nit display and a 100-hour battery in power-saving mode.',
		isActive: true,
		variants: [
			{
				variantId: 'V001',
				color: 'Titanium Blue',
				colorHex: '#2E4A7D',
				size: 47,
				stock: 0, // deliberately out of stock — exercises the sold-out path
				price: 649.99,
				case: 'titanium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('2E4A7D', 'Watch Ultra Blue')],
				featured: true,
				sku: 'TEMP-P001-V001',
				specs: {
					weight: '60.5g',
					battery: '590mAh',
					waterResistance: '10ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
			{
				variantId: 'V002',
				color: 'Titanium Gray',
				colorHex: '#6E6E73',
				size: 47,
				stock: 15,
				price: 649.99,
				case: 'titanium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('6E6E73', 'Watch Ultra Gray')],
				featured: false,
				sku: 'TEMP-P001-V002',
				specs: {
					weight: '60.5g',
					battery: '590mAh',
					waterResistance: '10ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
			{
				variantId: 'V003',
				color: 'Titanium Silver',
				colorHex: '#C9CCD1',
				size: 47,
				stock: 4,
				price: 649.99,
				case: 'titanium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('C9CCD1', 'Watch Ultra Silver')],
				featured: false,
				sku: 'TEMP-P001-V003',
				specs: {
					weight: '60.5g',
					battery: '590mAh',
					waterResistance: '10ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
			{
				variantId: 'V004',
				color: 'Titanium White',
				colorHex: '#F2F2F0',
				size: 47,
				stock: 5,
				price: 649.99,
				case: 'titanium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('F2F2F0', 'Watch Ultra White')],
				featured: false,
				sku: 'TEMP-P001-V004',
				specs: {},
				isActive: true,
			},
		],
	},

	// ─── P002 — standard multi-variant ───────────────────────────────────────
	{
		productId: 'P002',
		name: 'Apple Watch Series 10',
		slug: 'apple-watch-series-10',
		brandId: 'B002',
		categoryId: 'C001',
		description:
			'The thinnest Apple Watch yet, with a wide-angle OLED display and fast charging ' +
			'that reaches 80% in about 30 minutes.',
		isActive: true,
		variants: [
			{
				variantId: 'V005',
				color: 'Jet Black',
				colorHex: '#1C1C1E',
				size: 46,
				stock: 22,
				price: 429.0,
				case: 'aluminium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('1C1C1E', 'Series 10 Black')],
				featured: true,
				sku: 'TEMP-P002-V005',
				specs: {
					weight: '41.7g',
					display: 'LTPO3 OLED',
					waterResistance: '5ATM',
				},
				isActive: true,
			},
			{
				variantId: 'V006',
				color: 'Rose Gold',
				colorHex: '#E8B4A0',
				size: 42,
				stock: 9,
				price: 399.0,
				case: 'aluminium',
				mode: ['bluetooth', 'wifi', 'gps'],
				images: [img('E8B4A0', 'Series 10 Rose')],
				featured: false,
				sku: 'TEMP-P002-V006',
				specs: {
					weight: '29.3g',
					display: 'LTPO3 OLED',
					waterResistance: '5ATM',
				},
				isActive: true,
			},
			{
				variantId: 'V007',
				color: 'Slate Titanium',
				colorHex: '#4A4A4F',
				size: 46,
				stock: 3,
				price: 699.0,
				case: 'titanium',
				mode: ['cellular', 'bluetooth', 'wifi', 'gps'],
				images: [img('4A4A4F', 'Series 10 Slate')],
				featured: false,
				sku: 'TEMP-P002-V007',
				specs: {
					weight: '34.4g',
					display: 'LTPO3 OLED',
					waterResistance: '5ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
		],
	},

	// ─── P003 — premium, low stock ───────────────────────────────────────────
	{
		productId: 'P003',
		name: 'Fenix 8 Solar',
		slug: 'fenix-8-solar',
		brandId: 'B003',
		categoryId: 'C001',
		description:
			'Multisport GPS watch with solar charging, built-in torch and mapping. ' +
			'Up to 30 days of battery in smartwatch mode with sufficient sun exposure.',
		isActive: true,
		variants: [
			{
				variantId: 'V008',
				color: 'Carbon Black',
				colorHex: '#23252B',
				size: 51,
				stock: 2,
				price: 1199.99,
				case: 'titanium',
				mode: ['bluetooth', 'wifi', 'gps'],
				images: [img('23252B', 'Fenix 8 Black')],
				featured: true,
				sku: 'TEMP-P003-V008',
				specs: {
					weight: '93g',
					battery: 'Up to 30 days',
					waterResistance: '10ATM',
					glass: 'Power Sapphire',
					solar: 'Yes',
				},
				isActive: true,
			},
			{
				variantId: 'V009',
				color: 'Sandstone',
				colorHex: '#C2B280',
				size: 47,
				stock: 6,
				price: 1099.99,
				case: 'titanium',
				mode: ['bluetooth', 'wifi', 'gps'],
				images: [img('C2B280', 'Fenix 8 Sand')],
				featured: false,
				sku: 'TEMP-P003-V009',
				specs: {
					weight: '79g',
					battery: 'Up to 24 days',
					waterResistance: '10ATM',
					glass: 'Power Sapphire',
					solar: 'Yes',
				},
				isActive: true,
			},
		],
	},

	// ─── P004 — single variant, budget ───────────────────────────────────────
	{
		productId: 'P004',
		name: 'T-Rex 3',
		slug: 't-rex-3',
		brandId: 'B004',
		categoryId: 'C001',
		description:
			'Military-grade outdoor watch tested against extreme heat, cold and humidity. ' +
			'Offline maps and a 27-day typical battery life.',
		isActive: true,
		variants: [
			{
				variantId: 'V010',
				color: 'Onyx',
				colorHex: '#2B2B2B',
				size: 48,
				stock: 31,
				price: 279.99,
				case: 'stainless steel',
				mode: ['bluetooth', 'gps'],
				images: [img('2B2B2B', 'T-Rex 3')],
				featured: false,
				sku: 'TEMP-P004-V010',
				specs: {
					weight: '68.3g',
					battery: '700mAh',
					waterResistance: '10ATM',
				},
				isActive: true,
			},
		],
	},

	// ─── P005 — hybrid category ──────────────────────────────────────────────
	{
		productId: 'P005',
		name: 'Watch GT 5 Pro',
		slug: 'watch-gt-5-pro',
		brandId: 'B005',
		categoryId: 'C002',
		description:
			'A hybrid design pairing a classic analogue face with smart tracking. ' +
			'Titanium body, sapphire glass and two weeks of typical use per charge.',
		isActive: true,
		variants: [
			{
				variantId: 'V011',
				color: 'Brown Leather',
				colorHex: '#6B4423',
				size: 46,
				stock: 12,
				price: 379.99,
				case: 'titanium',
				mode: ['bluetooth', 'gps'],
				images: [img('6B4423', 'GT 5 Pro Brown')],
				featured: true,
				sku: 'TEMP-P005-V011',
				specs: {
					weight: '53g',
					battery: 'Up to 14 days',
					waterResistance: '5ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
			{
				variantId: 'V012',
				color: 'Black Ceramic',
				colorHex: '#121212',
				size: 42,
				stock: 7,
				price: 419.99,
				case: 'ceramic',
				mode: ['bluetooth', 'gps'],
				images: [img('121212', 'GT 5 Pro Black')],
				featured: false,
				sku: 'TEMP-P005-V012',
				specs: {
					weight: '48g',
					battery: 'Up to 7 days',
					waterResistance: '5ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
		],
	},

	// ─── P006 — fitness band ─────────────────────────────────────────────────
	{
		productId: 'P006',
		name: 'Charge 6',
		slug: 'charge-6',
		brandId: 'B006',
		categoryId: 'C003',
		description:
			'A slim fitness band with built-in GPS, ECG and a seven-day battery. ' +
			'Tracks 40 exercise modes and connects to gym equipment over Bluetooth.',
		isActive: true,
		variants: [
			{
				variantId: 'V013',
				color: 'Obsidian',
				colorHex: '#343438',
				size: 37,
				stock: 44,
				price: 159.95,
				case: 'aluminium',
				mode: ['bluetooth', 'gps'],
				images: [img('343438', 'Charge 6')],
				featured: false,
				sku: 'TEMP-P006-V013',
				specs: {
					weight: '37.6g',
					battery: 'Up to 7 days',
					waterResistance: '5ATM',
				},
				isActive: true,
			},
		],
	},

	// ─── P007 — hybrid, two variants ─────────────────────────────────────────
	{
		productId: 'P007',
		name: 'ScanWatch 2',
		slug: 'scanwatch-2',
		brandId: 'B007',
		categoryId: 'C002',
		description:
			'A medical-grade hybrid watch with real analogue hands over a small OLED window. ' +
			'Tracks temperature variation and heart rhythm continuously for up to 30 days.',
		isActive: true,
		variants: [
			{
				variantId: 'V014',
				color: 'Midnight Blue',
				colorHex: '#1B2A4A',
				size: 42,
				stock: 8,
				price: 349.95,
				case: 'stainless steel',
				mode: ['bluetooth'],
				images: [img('1B2A4A', 'ScanWatch Blue')],
				featured: false,
				sku: 'TEMP-P007-V014',
				specs: {
					weight: '34g',
					battery: 'Up to 30 days',
					waterResistance: '5ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
			{
				variantId: 'V015',
				color: 'Pearl White',
				colorHex: '#EDE9E3',
				size: 38,
				stock: 5,
				price: 349.95,
				case: 'stainless steel',
				mode: ['bluetooth'],
				images: [img('EDE9E3', 'ScanWatch White')],
				featured: false,
				sku: 'TEMP-P007-V015',
				specs: {
					weight: '30g',
					battery: 'Up to 30 days',
					waterResistance: '5ATM',
					glass: 'Sapphire Crystal',
				},
				isActive: true,
			},
		],
	},

	// ─── P008 — DISCONTINUED PRODUCT (isActive: false at product level) ──────
	{
		productId: 'P008',
		name: 'Instinct 2 Solar',
		slug: 'instinct-2-solar',
		brandId: 'B003',
		categoryId: 'C001',
		description:
			'Discontinued, superseded by the Instinct 3 line. Retained for order history ' +
			'and to exercise the inactive-product path.',
		isActive: false,
		variants: [
			{
				variantId: 'V016',
				color: 'Graphite',
				colorHex: '#3A3A3C',
				size: 45,
				stock: 1,
				price: 349.99,
				case: 'stainless steel',
				mode: ['bluetooth', 'gps'],
				images: [img('3A3A3C', 'Instinct 2')],
				featured: false,
				sku: 'TEMP-P008-V016',
				specs: { battery: 'Unlimited in solar mode' },
				isActive: true,
			},
		],
	},

	// ─── P009 — band, single variant ─────────────────────────────────────────
	{
		productId: 'P009',
		name: 'Galaxy Fit 3',
		slug: 'galaxy-fit-3',
		brandId: 'B001',
		categoryId: 'C003',
		description:
			'A lightweight band with a 1.6-inch AMOLED display and 13 days of battery. ' +
			'Automatic workout detection and fall detection built in.',
		isActive: true,
		variants: [
			{
				variantId: 'V017',
				color: 'Pink Gold',
				colorHex: '#E7B9AC',
				size: 36,
				stock: 26,
				price: 59.99,
				case: 'aluminium',
				mode: ['bluetooth'],
				images: [img('E7B9AC', 'Galaxy Fit 3')],
				featured: false,
				sku: 'TEMP-P009-V017',
				specs: { weight: '18.5g', battery: '208mAh' },
				isActive: true,
			},
		],
	},

	// ─── P010 — one RETIRED VARIANT (isActive: false at variant level) ───────
	{
		productId: 'P010',
		name: 'Apple Watch SE 3',
		slug: 'apple-watch-se-3',
		brandId: 'B002',
		categoryId: 'C001',
		description:
			'The entry point to the Apple Watch line, with crash detection, sleep tracking ' +
			'and the same core fitness features as the flagship.',
		isActive: true,
		variants: [
			{
				variantId: 'V018',
				color: 'Starlight',
				colorHex: '#F0E6D2',
				size: 44,
				stock: 18,
				price: 249.0,
				case: 'aluminium',
				mode: ['bluetooth', 'wifi', 'gps'],
				images: [img('F0E6D2', 'SE 3 Starlight')],
				featured: true,
				sku: 'TEMP-P010-V018',
				specs: { weight: '32.9g', waterResistance: '5ATM' },
				isActive: true,
			},
			{
				variantId: 'V019',
				color: 'Midnight',
				colorHex: '#1D1D1F',
				size: 40,
				stock: 0,
				price: 219.0,
				case: 'aluminium',
				mode: ['bluetooth', 'wifi', 'gps'],
				images: [img('1D1D1F', 'SE 3 Midnight')],
				featured: false,
				sku: 'TEMP-P010-V019',
				specs: {},
				isActive: false, // retired variant — should not be purchasable
			},
		],
	},
];

// Highest sequence number used per counter, so the seed can set counters past
// the fixture. generateUniqueId() increments before use, so setting seq to the
// max used here means the next generated ID is max + 1.
export const counterSeeds = [
	{ _id: 'product', seq: 10 }, // P001..P010
	{ _id: 'variant', seq: 19 }, // V001..V019
	{ _id: 'brand', seq: 7 }, // B001..B007
	{ _id: 'category', seq: 3 }, // C001..C003
	{ _id: 'order', seq: 0 }, // no seeded orders
];

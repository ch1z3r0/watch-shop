// backend/scripts/seed.js
//
// Seeds brands, categories, products and ID counters from backend/seeds/data.js.
//
//   node scripts/seed.js --dry-run     show what would happen, change nothing
//   node scripts/seed.js               upsert the fixture (safe, additive)
//   node scripts/seed.js --fresh       DELETE those collections first, then insert
//
// SAFETY: refuses to run against a connection string that does not look like a
// development database unless --force is passed. --fresh against a non-dev
// database always requires --force as well.

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import Brand from '../models/Brand.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Counter from '../models/Counter.js';
import { brands, categories, products, counterSeeds } from '../seeds/data.js';

const DRY_RUN = process.argv.includes('--dry-run');
const FRESH = process.argv.includes('--fresh');
const FORCE = process.argv.includes('--force');

// ─── Safety ──────────────────────────────────────────────────────────────────

const DEV_HINTS = ['localhost', '127.0.0.1', '-dev', '_dev', 'dev-', 'test'];

const looksLikeDev = (uri) => {
	const lower = uri.toLowerCase();
	return DEV_HINTS.some((hint) => lower.includes(hint));
};

// Print the host only — never the credentials.
const safeUri = (uri) => {
	try {
		const afterAt = uri.split('@')[1] ?? uri;
		return afterAt.split('?')[0];
	} catch {
		return '(unparseable)';
	}
};

// ─── Seeding ─────────────────────────────────────────────────────────────────

const upsertAll = async (Model, docs, key) => {
	let created = 0;
	let updated = 0;

	for (const doc of docs) {
		const existing = await Model.findOne({ [key]: doc[key] });
		if (DRY_RUN) {
			existing ? updated++ : created++;
			continue;
		}
		if (existing) {
			// Replace the whole document so the fixture is authoritative.
			await Model.findOneAndReplace({ [key]: doc[key] }, doc, {
				runValidators: true,
			});
			updated++;
		} else {
			await Model.create(doc);
			created++;
		}
	}

	return { created, updated };
};

const run = async () => {
	const uri = process.env.SEED_MONGO_URI;

	if (!uri) {
		console.error('MONGO_URI is not set. Check backend/.env');
		process.exit(1);
	}

	const isDev = looksLikeDev(uri);

	console.log(`\ntarget:   ${safeUri(uri)}`);
	console.log(
		`mode:     ${DRY_RUN ? 'dry-run' : FRESH ? 'FRESH (destructive)' : 'upsert'}`,
	);
	console.log(
		`detected: ${isDev ? 'development database' : 'NOT a development database'}\n`,
	);

	if (!DRY_RUN && !isDev && !FORCE) {
		console.error(
			'Refusing to seed: this connection string does not look like a development\n' +
				'database. Nothing has been changed.\n\n' +
				'If you are certain, re-run with --force.\n',
		);
		process.exit(1);
	}

	if (FRESH && !isDev && !FORCE) {
		console.error('Refusing --fresh against a non-development database.\n');
		process.exit(1);
	}

	await mongoose.connect(uri);

	if (FRESH) {
		if (DRY_RUN) {
			console.log(
				'[dry-run] would DELETE all products, brands, categories and counters\n',
			);
		} else {
			console.log(
				'deleting existing products, brands, categories, counters...',
			);
			await Promise.all([
				Product.deleteMany({}),
				Brand.deleteMany({}),
				Category.deleteMany({}),
				Counter.deleteMany({}),
			]);
		}
	}

	const b = await upsertAll(Brand, brands, 'brandId');
	console.log(
		`${DRY_RUN ? '[dry-run] ' : ''}brands:     ${b.created} created, ${b.updated} updated`,
	);

	const c = await upsertAll(Category, categories, 'categoryId');
	console.log(
		`${DRY_RUN ? '[dry-run] ' : ''}categories: ${c.created} created, ${c.updated} updated`,
	);

	const p = await upsertAll(Product, products, 'productId');
	const variantCount = products.reduce(
		(n, prod) => n + prod.variants.length,
		0,
	);
	console.log(
		`${DRY_RUN ? '[dry-run] ' : ''}products:   ${p.created} created, ${p.updated} updated ` +
			`(${variantCount} variants)`,
	);

	// Counters: only ever move forward, so seeding a database that already has
	// higher IDs cannot cause the app to reissue an existing one.
	for (const { _id, seq } of counterSeeds) {
		const current = await Counter.findById(_id);
		const next = Math.max(current?.seq ?? 0, seq);

		if (DRY_RUN) {
			console.log(`[dry-run] counter ${_id}: ${current?.seq ?? 0} -> ${next}`);
			continue;
		}

		await Counter.findByIdAndUpdate(
			_id,
			{ $set: { seq: next } },
			{ upsert: true, returnDocument: 'after' },
		);
	}
	if (!DRY_RUN) console.log('counters:   synced');

	console.log(
		`\n${DRY_RUN ? 'dry-run complete — nothing changed.' : 'seed complete.'}\n`,
	);
	await mongoose.disconnect();
};

run().catch((err) => {
	console.error(err);
	process.exit(1);
});

const WooCommerceRestApi = require( '@woocommerce/woocommerce-rest-api' ).default;

/**
 * IMPORTANT (Vercel/CI builds):
 * This file is imported during `next build` when collecting page data.
 * If env vars aren't configured yet, creating the API client at import-time can crash the build.
 * So we create it lazily and fail soft (return empty data) when required env vars are missing.
 */
let apiClient = null;

const getWooClient = () => {
	if ( apiClient ) {
		return apiClient;
	}

	const url = process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL || 'https://zentea.com';
	const consumerKey = process.env.WC_CONSUMER_KEY;
	const consumerSecret = process.env.WC_CONSUMER_SECRET;

	// If keys are missing (common in CI), don't throw—just return null.
	if ( ! consumerKey || ! consumerSecret ) {
		return null;
	}

	apiClient = new WooCommerceRestApi( {
		url,
		consumerKey,
		consumerSecret,
		version: 'wc/v3',
	} );

	return apiClient;
};

/**
 * Get Products.
 *
 * @return {Promise<void>}
 */
export const getProductsData = async ( perPage = 50 ) => {
	const api = getWooClient();
	if ( ! api ) {
		return { data: [] };
	}

	return await api.get(
		'products',
		{
			per_page: perPage || 50,
		},
	);
};

/**
 * Get Single Product By Slug.
 *
 * @return {Promise<void>}
 */
export const getProductBySlug = async ( productSlug = '' ) => {
	const api = getWooClient();
	if ( ! api ) {
		return { data: [] };
	}

	return await api.get(
		'products',
		{
			slug: productSlug,
		},
	);
};
